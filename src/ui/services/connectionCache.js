angular.module('app').factory('connectionCache', [
  function() {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');

    var CONNECTION_CACHE = [];

    function ConnectionCache() {}
    util.inherits(ConnectionCache, EventEmitter);

    ConnectionCache.prototype.EVENTS = {
      CONNECTION_CACHE_CHANGED: 'CONNECTION_CACHE_CHANGED'
    };

    ConnectionCache.prototype.findById = function(connectionId) {
      if (!connectionId) return;

      return _.findWhere(CONNECTION_CACHE, {
        id: connectionId
      });
    };

    ConnectionCache.prototype.add = function(connection) {
      if (!connection) return;

      CONNECTION_CACHE.push(connection);

      this.emit(this.EVENTS.CONNECTION_CACHE_CHANGED, CONNECTION_CACHE);

      return CONNECTION_CACHE;
    };

    ConnectionCache.prototype.updateById = function(connectionId, updates) {
      if (!connectionId) return;

      var connection = this.findById(connectionId);

      if (connection) {
        connection = _.extend(connection, updates);

        this.emit(this.EVENTS.CONNECTION_CACHE_CHANGED, CONNECTION_CACHE);
      }

      return CONNECTION_CACHE;
    };

    ConnectionCache.prototype.list = function() {
      return CONNECTION_CACHE;
    };

    ConnectionCache.prototype.exists = function(connection) {
      var index = CONNECTION_CACHE.indexOf(connection);

      return index >= 0 ? true : false;
    };

    ConnectionCache.prototype.existsByName = function(connectionName) {
      var existingConnection = _.findWhere(CONNECTION_CACHE, {
        name: connectionName
      });

      return existingConnection ? true : false;
    };

    ConnectionCache.prototype.removeById = function(connectionId) {
      if (!connectionId) return;

      var connection = this.findById(connectionId);
      var index = CONNECTION_CACHE.indexOf(connection);

      if (index >= 0) {
        CONNECTION_CACHE.splice(index, 1);
        this.emit(this.EVENTS.CONNECTION_CACHE_CHANGED, CONNECTION_CACHE);
      }

      return CONNECTION_CACHE;
    };

    ConnectionCache.prototype.removeAll = function() {
      this.emit(this.EVENTS.CONNECTION_CACHE_CHANGED, CONNECTION_CACHE);

      CONNECTION_CACHE.length = 0;
    };

    return new ConnectionCache();
  }
]);
