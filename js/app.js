var app = angular.module("myapp", []);

app.controller('AppController', function($scope, $q) {
  var db = new PouchDB('todos');

  $scope.addTodo = function() {
    $scope.writeTodoOnDb({
      title: $scope.todoText,
      completed: false
    });
  };

  $scope.writeTodoOnDb = function(todo) {
    var promiseToCall = todo._id ? db.put(todo) : db.post(todo);
    $q.when(promiseToCall)
      .then(function() {
        $scope.todoText = '';
        $scope.showTodos();
      }, console.log);
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

  $scope.editTodo = function(todo) {
    todo.title += '.';
    $scope.writeTodoOnDb(todo);
  };

  $scope.removeTodo = function(todo) {
    $q.when(db.remove(todo))
      .then(function() {
        $scope.showTodos();
      });
  };

  $scope.showTodos();
});
