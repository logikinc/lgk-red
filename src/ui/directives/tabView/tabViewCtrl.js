angular.module('app').controller('tabViewCtrl', [
  '$scope',
  'tabCache',
  'connectionCache',
  '$timeout',
  'menuService',
  function($scope, tabCache, connectionCache, $timeout, menuService) {
    $scope.tabs = tabCache.list();
    $scope.connections = connectionCache.list();

    $scope.TAB_TYPES = tabCache.TYPES;

    $scope.sortableOptions = {
      //http://api.jqueryui.com/sortable
      placeholder: 'sortable-placeholder',
      delay: 150,
      appendTo: 'body',
      revert: 50,
      helper: function(e, item) {
        $timeout(function() {
          //force the element to show, race condition :(
          item.attr('style', 'display: block !important');
        });
        return item.clone();
      },
      // helper: 'clone',
      opacity: 1,
      tolerance: 'intersect',
      stop: function(event, ui) {
        $timeout(function() {
          //activate the dropped tab
          var tabId = angular.element(ui.item).attr('tab-id');

          if (!tabId) return;

          tabCache.activateById(tabId);
        });
      }
    };

    tabCache.on(tabCache.EVENTS.TAB_CACHE_CHANGED, function(updatedCache) {
      $scope.tabs = updatedCache;
    });

    connectionCache.on(connectionCache.EVENTS.CONNECTION_CACHE_CHANGED, function(updatedCache) {
      $scope.connections = updatedCache;
    });

    $scope.openTabContextMenu = function(tab, $event) {
      if (!tab) return;
      if ($event) $event.preventDefault();

      menuService.showMenu([{
        label: 'Close Tab',
        click: function() {
          $timeout(function() {
            if (tab.active) tabCache.activateNext();
            tabCache.remove(tab);
          });
        }
      }, {
        label: 'Close Other Tabs',
        click: function() {
          $timeout(function() {
            if (!tab.active) tabCache.activateById(tab.id);
            tabCache.removeAll([tab.id]);
          });
        }
      }]);
    };

    $scope.activateTab = function(tab, $event) {
      if ($event) $event.preventDefault();

      if ($event.button === 1) return $scope.closeTab(tab, $event);

      if (tab.active) return;
      else {
        tabCache.deactivateAll();
        tab.active = true;
      }
    };

    $scope.closeTab = function(tab, $event) {
      if ($event) $event.preventDefault();

      tabCache.remove(tab);
    };
  }
]);
