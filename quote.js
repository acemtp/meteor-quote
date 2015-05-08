
Quotes = new Mongo.Collection('quotes');
Groups = new Mongo.Collection('groups');

if (Meteor.isClient) {

  Meteor.subscribe('userData');

  Session.setDefault('modal', 'welcome');

  Accounts.ui.config({
    requestPermissions: {
      facebook: ['public_profile', 'email', 'user_friends'],
    }
  });

  Accounts.onLogin(function () {
    console.log('logged');
    Session.set('modal', 'quotes');
  });

  Template.modal.helpers({
    modal: function () {
      return Session.get('modal');
    },
  });

  //

  Template.welcome.events({
    'click .login': function () {
      console.log('dsf');
      Meteor.loginWithFacebook();
    }
  });

  //

  Template.quotes.helpers({
    quotes: function () {
      return Quotes.find({}, { sort: { createdAt: -1 } });
    },
  });

  Template.quotes.events({
    'click .add': function () {
      console.log('add');
      Session.set('modal', 'add');
    }
  });

  //

  Template.add.events({
    'click .back': function () {
      console.log('back');
      Session.set('modal', 'quotes');
    },
    'click .next': function () {
      console.log('next');

      Session.set('quote', $('.quote').val());

      Session.set('modal', 'who');
    }
  });

  //

  Template.who.helpers({
    users: function() {
      var me = Meteor.user();
      if(!me || !me.friendIds) return;
      return Meteor.users.find({ _id: { $in: me.friendIds } }, { sort: { 'profile.name': 1 } });
    },
  });

  Template.who.events({
    'click .back': function () {
      console.log('back');
      Session.set('modal', 'add');
    },
    'click .next': function () {
      console.log('next');
      Session.set('modal', 'groups');
    },
    'click .select': function () {
      console.log('select', this);

      Session.set('quoteWho', this.facebook.name);

      Session.set('modal', 'groups');
    }
  });

  //

  Template.groups.helpers({
    groups: function() {
      return Groups.find({}, { sort: { createdAt: -1 } });
    },
  });

  Template.groups.events({
    'click .back': function () {
      console.log('back');
      Session.set('modal', 'add');
    },
    'click .next': function () {
      console.log('next');
      Session.set('modal', 'groups');
    },
    'click .create': function () {
      console.log('create');
      Session.set('modal', 'create');
    }
  });

  //

  Template.create.helpers({
    facebookUsers: function () {
      return FacebookUsers.find({ userId: Meteor.userId() }, { sort: { createdAt: -1 } });
    },
    selected: function () {
      console.log('///', _.indexOf(Session.get('groupSelect'), this._id));
      return _.indexOf(Session.get('groupSelect'), this._id) >= 0;
    }
  });

  Template.create.events({
    'click .back': function () {
      console.log('back');
      Session.set('modal', 'groups');
    },
    'click .next': function () {
      console.log('next');

      var gs = Session.get('groupSelect') || [];
// XXX refaire les groupes avec des listes d id meteor
//      Groups.insert({ userId: Meteor.userId(), gs });      

      Session.set('modal', 'groups');
    },
    'click .select': function () {
      console.log('select', this);

      var gs = Session.get('groupSelect') || [];

      if(_.indexOf(gs, this._id) >= 0) {
        gs = _.without(gs, this._id);
      } else {
        gs.push(this._id);
      }
      Session.set('groupSelect', gs);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('userData', function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId },
                               { fields: { friendIds: 1 } });
    } else {
      this.ready();
    }
  });

  Accounts.onLogin(function (cnx) {
    console.log('login', cnx);

    var options = {
      params: {
        access_token: cnx.user.services.facebook.accessToken
      }
    };

    var res = HTTP.get('https://graph.facebook.com/me/friends', options);

    console.log('res', res);

    _.each(res.data.data, function (user) {
      console.log('user found from facebook api', user);

      var friend = Meteor.users.findOne({ 'services.facebook.id': user.id });
      if(!friend) return console.log('friend not found in meteor users', user);

      Meteor.users.update(cnx.user._id, { $addToSet: { friendIds: friend._id } });
      Meteor.users.update(friend._id, { $addToSet: { friendIds: cnx.user._id } });
    });

  });

}
