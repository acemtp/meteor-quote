
Quotes = new Mongo.Collection('quotes');
FacebookUsers = new Mongo.Collection('facebookUsers');
Groups = new Mongo.Collection('groups');

if (Meteor.isClient) {

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
    facebookUsers: function() {
      return FacebookUsers.find({ userId: Meteor.userId() }, { sort: { createdAt: -1 } });
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
      Groups.insert({ userId: Meteor.userId(), gs });      

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
      console.log('user found', user);
      if(!FacebookUsers.findOne({ userId: cnx.user._id, 'facebook.id': user.id })) {
        console.log('insert facebook user', cnx.user._id, user);
        FacebookUsers.insert({ userId: cnx.user._id, facebook: user });
      }
    });

  });

}
