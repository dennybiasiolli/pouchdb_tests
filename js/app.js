var app = angular.module("myapp", []);

app.controller('AppController', function($scope, $q) {
  var db = new PouchDB('todos');

  $scope.addTodo = function() {
    var todo = {
      title: $scope.todoText,
      completed: false
    };
    $q.when(db.post(todo))
      .then(function() {
        $scope.showTodos();
      });
  };

  $scope.showTodos = function() {
    $scope.todos = [];
    $q.when(db.allDocs({
        include_docs: true,
        // descending: true
      }))
      .then(function(results) {
        $scope.todos = results.rows;
      });
  };

  $scope.removeTodo = function(todo) {
    $q.when(db.remove(todo))
      .then(function() {
        $scope.showTodos();
      });
  };

  $scope.showTodos();
});
