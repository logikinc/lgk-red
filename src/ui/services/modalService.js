'use strict';

angular.module('app').service('modalService', [
  '$uibModal',
  '$uibModalStack',
  function($uibModal, $uibModalStack) {
    const Promise = require('bluebird');

    function ModalService() {}

    ModalService.prototype.openConnectionManager = function openConnectionManager(page) {
      return openModal({
        templateUrl: __dirname + '/components/connect/connect.html',
        controller: 'connectCtrl',
        resolve: {
          page: [function() {
            return page;
          }]
        }
      });
    };

    ModalService.prototype.openAddDatabase = function openAddDatabase(connection) {
      return openModal({
        templateUrl: __dirname + '/components/addDatabase/addDatabase.html',
        controller: 'addDatabaseCtrl',
        resolve: {
          connection: [function() {
            return connection;
          }]
        }
      });
    };

    ModalService.prototype.openAddCollection = function openAddCollection(database) {
      return openModal({
        templateUrl: __dirname + '/components/addCollection/addCollection.html',
        controller: 'addCollectionCtrl',
        resolve: {
          database: [function() {
            return database;
          }]
        }
      });
    };

    ModalService.prototype.openQueryResultsExport = function openQueryResultsExport(collection, query) {
      return openModal({
        templateUrl: __dirname + '/components/queryResultsExportModal/queryResultsExportModal.html',
        controller: 'queryResultsExportModalCtrl',
        resolve: {
          query: [function() {
            return query;
          }],
          collection: [function() {
            return collection;
          }]
        },
        size: 'lg'
      });
    };

    ModalService.prototype.confirm = function confirm(options) {
      if (!options) throw new Error('options is required');

      return openModal({
        template: '<div class="modal-body">' + options.message + '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="cancel()">' + (options.cancelButtonMessage || 'Cancel') + '</button><button class="btn btn-primary" ng-click="ok()">' + (options.confirmButtonMessage || 'Confirm') + '</button>' +
          '</div>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function($scope, $uibModalInstance) {
            $scope.message = options.confirmMessage;

            $scope.ok = function() {
              $uibModalInstance.close(1);
            };

            $scope.cancel = function() {
              $uibModalInstance.dismiss('cancel');
            };
          }
        ],
        size: options.size
      });
    };

    ModalService.prototype.openDeleteResult = function openDeleteResult(result, collection) {
      var _this = this;

      return new Promise((resolve, reject) => {
        _this.confirm({
          message: 'Are you sure you want to delete this document?',
          confirmButtonMessage: 'Yes',
          cancelButtonMessage: 'No'
        }).result.then(function() {
          collection.deleteById(result._id)
            .then(resolve)
            .catch(reject);
        });
      });
    };

    function closeAllModals() {
      $uibModalStack.dismissAll();
    }

    function openModal(opts) {
      if (!opts) return;

      closeAllModals();

      return $uibModal.open(opts);
    }

    return new ModalService();
  }
]);
