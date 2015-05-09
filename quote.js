// XXX search
// XXX picturesgroups
// XXX ca poste la quote que dans un group (publish que les quotes dont on fait parti du groupe, un quote doit contenur un groupId et pas un quoteId)
// XXX plugin facebook cordova


Quotes = new Mongo.Collection('quotes');
Groups = new Mongo.Collection('groups');

if (Meteor.isClient) {

  Meteor.subscribe('userData');
  Meteor.subscribe('quotes');
  Meteor.subscribe('friends');
  Meteor.subscribe('groups');

  Session.setDefault('modal', 'welcome');

  Accounts.ui.config({
    requestPermissions: {
      facebook: ['public_profile', 'email', 'user_friends'],
    }
  });

  Accounts.onLogin(function () {
    console.log('logged');
<<<<<<< HEAD
    Session.set('modal', 'quotes');
//Session.set('modal', 'add');
=======
    //Session.set('modal', 'quotes');
    Session.set('modal', 'groups');
>>>>>>> e44939951bd4ca0432e9ab574c6df62a3fe12804
  });

  Template.modal.helpers({
    modal: function () {
      return Session.get('modal');
    },
  });

  //

  Template.welcome.events({
    'click .login': function () {
      Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'email', 'user_friends']
      });
    }
  });

  //

  Template.quotes.helpers({
    quotes: function () {
      return Quotes.find({}, { sort: { createdAt: -1 } });
    },
    username: function (userId) {
      console.log('user', userId, this);
      var user = Meteor.users.findOne(userId);
      if(!user) return 'Anonymous';
      console.log('user', user);
      return user.profile.name;
    },
    loveCount: function () {
      return this.loverIds.length;
    },
    loved: function () {
      return _.indexOf(this.loverIds, Meteor.userId()) !== -1;
    },
  });

  Template.quotes.events({
    'click .addbtn': function () {
      console.log('add');
      Session.set('modal', 'add');
    },
    'click .quote, click .vote': function () {
      console.log('vote', this);
      if(_.indexOf(this.loverIds, Meteor.userId()) === -1) {
        Quotes.update(this._id, { $addToSet: { loverIds: Meteor.userId() } });
      } else {
        Quotes.update(this._id, { $pull: { loverIds: Meteor.userId() } });
      }
    },
    'click .logout': function () {
      Meteor.logout();
    }
  });

  //

  Template.add.events({
    'click .add': function () {
      //$('').focus;
    },
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

  Template.add.onRendered(function () {
    $('.quote').focus();
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
    'click .user': function () {
      console.log('select', this);

      Session.set('quoteBy', this._id);

      Session.set('modal', 'groups');
    }
  });

  //

  Template.groups.helpers({
    groups: function() {
      return Groups.find({}, { sort: { createdAt: -1 } });
    },
    members: function () {
      return Meteor.users
        .find({ _id: { $in: this.userIds }}, { limit: 4 })
        .map(function (user) { return user.profile.name; })
        .join(', ');
    },
    more: function () {
      return this.userIds.length <= 4 ? '' : ' and ' + (this.userIds.length - 4) + ' more...';
    },
  });

  Template.groups.events({
    'click .back': function () {
      console.log('back');
      Session.set('modal', 'who');
    },
    'click .next': function () {
      console.log('next');
      Session.set('modal', 'groups');
    },
    'click .group': function () {
      var quote = Session.get('quote');
      var quoteBy = Session.get('quoteBy');

      console.log('select', quote, quoteBy, this);

      Quotes.insert({ createdBy: Meteor.userId(), createdAt: new Date(), quote: quote, quoteBy: quoteBy, loverIds: [] });

      Session.set('quote', '');
      Session.set('quoteBy', '');
      Session.set('modal', 'quotes');
    },
    'click .create': function () {
      console.log('create');
      Session.set('modal', 'create');
    }
  });

  //

  Template.create.helpers({
    users: function() {
      var me = Meteor.user();
      if(!me || !me.friendIds) return;
      return Meteor.users.find({ _id: { $in: me.friendIds } }, { sort: { 'profile.name': 1 } });
    },
    selected: function () {
      return _.indexOf(Session.get('groupSelect'), this._id) >= 0;
    }
  });

  Template.create.events({
    'click .back': function () {
      console.log('back');
      Session.set('groupSelect', []);
      Session.set('modal', 'groups');
    },
    'click .next': function () {
      var gs = Session.get('groupSelect') || [];
      gs.push(Meteor.userId());

      var name = $('.groupname').val();
      console.log('next', name, gs);

      Groups.insert({ createdBy: Meteor.userId(), createdAt: new Date(), name: name, userIds: gs });

      Session.set('groupSelect', []);
      Session.set('modal', 'groups');
    },
    'click .user': function () {
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
  Meteor.publish('userData', function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId },
                               { fields: { friendIds: 1 } });
    } else {
      this.ready();
    }
  });
  Meteor.publish('quotes', function () {
    if (this.userId) {
      var user = Meteor.users.findOne(this.userId);
      user.friendIds.push(this.userId);
      return Quotes.find({ quoteBy: { $in: user.friendIds || [] } });
    } else {
      this.ready();
    }
  });
  Meteor.publish('friends', function () {
    if (this.userId) {
      var user = Meteor.users.findOne(this.userId);
      return Meteor.users.find({ _id: { $in: user.friendIds || [] } });
    } else {
      this.ready();
    }
  });
  Meteor.publish('groups', function () {
    if (this.userId) {
      return Groups.find({ userIds: this.userId });
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
    // get image if not already
    var res = HTTP.get('https://graph.facebook.com/me?fields=picture', options);
    Meteor.users.update(cnx.user._id, { $set: { 'profile.picture': res.data.picture.data.url }});

    var res = HTTP.get('https://graph.facebook.com/me/friends', options);

    console.log('***************** res', res);

    _.each(res.data.data, function (user) {
      console.log('----------------- user found from facebook api', user);

      var friend = Meteor.users.findOne({ 'services.facebook.id': user.id });
      if(!friend) return console.log('############### friend not found in meteor users', user);

      Meteor.users.update(cnx.user._id, { $addToSet: { friendIds: friend._id } });
      Meteor.users.update(friend._id, { $addToSet: { friendIds: cnx.user._id } });
    });

  });

}
