"use strict";

// apply after DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // generate random id for elements
  function randomString() {
    var chars = "0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var str = "";
    for (var i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

  // generate template with mustache usage
  function generateTemplate(name, data, basicElement) {
    var template = document.getElementById(name).innerHTML;
    var element = document.createElement(basicElement || "div");
    Mustache.parse(template);
    element.innerHTML = Mustache.render(template, data);

    return element;
  }

  // Board class constructor
  // function Board(name) {
  //   var self = this;

  //   this.id = randomString();
  //   this.name = name;
  //   this.element = generateTemplate("board-template", {
  //     name: this.name,
  //     id: this.id
  //   });
  // }

  //   Column class constructor
  function Column(name) {
    var self = this;

    this.id = randomString();
    this.name = name;
    this.element = generateTemplate("column-template", {
      name: this.name,
      id: this.id
    });

    // events
    this.element
      .querySelector(".column")
      .addEventListener("click", function(event) {
        if (
          event.target.classList.contains("btn-delete") ||
          event.target.classList.contains("fa-times")
        ) {
          self.removeColumn();
        }

        if (
          event.target.classList.contains("add-card") ||
          event.target.classList.contains("btn-add")
        ) {
          self.addCard(new Card(prompt("Enter the name of the card")));
        }
      });
  }
  // Column methods
  Column.prototype = {
    addCard: function(card) {
      this.element.querySelector("ul").appendChild(card.element);
      // initSortable(card.id);
    },
    removeColumn: function() {
      this.element.parentNode.removeChild(this.element);
    }
  };

  // Card class constructor
  function Card(description) {
    var self = this;

    this.id = randomString();
    this.description = description;
    this.element = generateTemplate(
      "card-template",
      { description: this.description, id: this.id },
      "li"
    );

    // events
    this.element
      .querySelector(".card")
      .addEventListener("click", function(event) {
        event.stopPropagation();

        if (event.target.classList.contains("btn-delete")) {
          self.removeCard();
        }
      });
  }
  // Card methods
  Card.prototype = {
    removeCard: function() {
      this.element.parentNode.removeChild(this.element);
    }
  };

  // board object
  var board = {
    name: "Kanban Board",
    addColumn: function(column) {
      this.element.appendChild(column.element);
      initSortable(column.id, "kanban-column");
      initSortable("col-container", "kanban-board");
    },
    element: document.querySelector("#board .column-container")
  };
  // button - create a column
  document
    .querySelector("#board .create-column")
    .addEventListener("click", function() {
      var name = prompt("Enter a column name");
      var column = new Column(name);
      board.addColumn(column);
    });

  // allow sorting cards
  function initSortable(id, group) {
    var el = document.getElementById(id);
    var sortable = Sortable.create(el, {
      group: group,
      sort: true,
      animation: 150
    });
  }

  // CREATING COLUMNS
  var todoColumn = new Column("To do");
  var doingColumn = new Column("Doing");
  var doneColumn = new Column("Done");

  // ADDING COLUMNS TO THE BOARD
  board.addColumn(todoColumn);
  board.addColumn(doingColumn);
  board.addColumn(doneColumn);

  // CREATING CARDS
  var card1 = new Card("New task");
  var card2 = new Card("Create kanban boards");

  // ADDING CARDS TO COLUMNS
  todoColumn.addCard(card1);
  doingColumn.addCard(card2);
});
