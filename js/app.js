var app = angular.module("myapp", []);

app.controller('AppController', function($scope, $q) {
  var db = new PouchDB('todos');
  $q.all([
      $q.when(db.createIndex({
        index: {
          name: 'objType',
          fields: ['objType']
        }
      })),
      $q.when(db.createIndex({
        index: {
          name: 'myIndex1',
          fields: ['title']
        }
      })),
    ])
    .then(function() {
      $scope.showTodos();
    });

  $scope.addTodo = function() {
    $scope.writeTodoOnDb({
      objType: 'todo',
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
    $q.when(db.find({
        selector: {
          objType: 'todo'
        }
      }))
      .then(function(results) {
        $scope.todos = results.docs;
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

  $scope.findTodo = function() {
    $scope.todos = [];
    $q.when(db.find({
        selector: {
          objType: 'todo',
          title: {
            $regex: $scope.findText
          }
        }
      }))
      .then(function(results) {
        $scope.todos = results.docs;
      });
  };

});
