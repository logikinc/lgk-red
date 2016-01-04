'use strict';

angular.module('app').controller('addConnectionCtrl', [
  '$scope',
  '$timeout',
  '$log',
  'notificationService',
  'connectionCache',
  function($scope, $timeout, $log, notificationService, connectionCache) {
    const connectionModule = require('lib/modules/connection');
    const Connection = require('lib/entities/connection');

    $scope.currentSubPage = 'server';

    $scope.testConnectionBtnOptions = {
      buttonSubmittingIcon: 'icon-left fa fa-spin fa-refresh',
      buttonSubmittingClass: 'btn-default',
      buttonSuccessIcon: 'icon-left fa fa-check',
      buttonErrorIcon: 'icon-left fa fa-remove',
      buttonDefaultIcon: 'fa fa-bolt',
      buttonDefaultText: 'Test Connection',
      buttonDefaultClass: 'btn-default',
      buttonSubmittingText: 'Connecting...',
      buttonSuccessText: 'Connected',
      buttonSuccessClass: 'btn-success',
      buttonErrorText: 'Error Connecting',
      buttonErrorClass: 'btn-danger'
    };

    $scope.addConnectionForm = $scope.selectedConnection ? _.extend({
      databaseName: ($scope.selectedConnection.databases && $scope.selectedConnection.databases.length) ? $scope.selectedConnection.databases[0].name : null
    }, $scope.selectedConnection) : {
      auth: {}
    };

    if ($scope.selectedConnection && ($scope.selectedConnection.databases && $scope.selectedConnection.databases.length)) {
      $scope.addConnectionForm.auth = $scope.selectedConnection.databases[0].auth;
    }

    $scope.$watch('addConnectionForm.host', function(val) {
      if (val === 'localhost') {
        $scope.addConnectionForm.databaseName = null;
      }
    });

    $scope.addConnectionFormSubmitted = false;

    $scope.addOrUpdateConnection = function(addConnectionForm) {
      $scope.addConnectionFormSubmitted = true;

      if (!addConnectionForm.$valid) return;

      if ($scope.addConnectionForm.enableAuth === false) {
        $scope.addConnectionForm.databaseName = null;
        $scope.addConnectionForm.auth = null;
      }

      if ($scope.selectedConnection && $scope.selectedConnection.id) {
        $scope.editConnection();
      } else {
        $scope.addConnection();
      }
    };

    $scope.addConnection = function() {
      connectionModule.create($scope.addConnectionForm)
        .then(function() {
          $timeout(function() {
            $scope.changePage('list');

            notificationService.success('Connection added');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            notificationService.error({
              title: 'Error adding connection',
              message: err
            });
            $log.log(err);
          });
        });
    };

    $scope.editConnection = function() {
      connectionModule.update($scope.addConnectionForm.id, $scope.addConnectionForm)
        .then(function(connection) {
          $timeout(function() {
            connectionCache.updateById($scope.addConnectionForm.id, connection);

            $scope.changePage('list');

            notificationService.success('Connection updated');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            notificationService.error({
              title: 'Error updating connection',
              message: err
            });
            $log.log(err);
          });
        });
    };

    $scope.testConnection = function($event) {
      if ($event) $event.preventDefault();

      $scope.isTestingConnection = true;

      let newConnection = new Connection($scope.addConnectionForm);

      var startTime = performance.now();

      newConnection.connect()
        .then(() => {
          var ellapsed = (performance.now() - startTime).toFixed(5);

          $timeout(() => {
            $scope.testConnectionResult = 'success';
          }, (ellapsed >= 1000 ? 0 : 1000));
        })
        .catch(() => {
          var ellapsed = (performance.now() - startTime).toFixed(5);

          $timeout(() => {
            $scope.testConnectionResult = 'error';
          }, (ellapsed >= 1000 ? 0 : 1000));
        });
    };
  }
]);
