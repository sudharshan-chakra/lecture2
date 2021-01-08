"use strict";
exports.__esModule = true;
exports.traverseExpr = exports.traverseStmt = exports.traverseStmts = exports.parseProgram = void 0;
var lezer_python_1 = require("lezer-python");
function parseProgram(source) {
    var t = lezer_python_1.parser.parse(source).cursor();
    return traverseStmts(source, t);
}
exports.parseProgram = parseProgram;
function traverseStmts(s, t) {
    // The top node in the program is a Script node with a list of children
    // that are various statements
    t.firstChild();
    var stmts = [];
    do {
        stmts.push(traverseStmt(s, t));
    } while (t.nextSibling()); // t.nextSibling() returns false when it reaches
    //  the end of the list of children
    return stmts;
}
exports.traverseStmts = traverseStmts;
/*
  Invariant – t must focus on the same node at the end of the traversal
*/
function traverseStmt(s, t) {
    switch (t.type.name) {
        case "AssignStatement":
            t.firstChild(); // focused on name (the first child)
            var name_1 = s.substring(t.from, t.to);
            t.nextSibling(); // focused on = sign. May need this for complex tasks, like +=!
            t.nextSibling(); // focused on the value expression
            var value = traverseExpr(s, t);
            t.parent();
            return { tag: "assign", name: name_1, value: value };
        case "ExpressionStatement":
            t.firstChild(); // The child is some kind of expression, the
            // ExpressionStatement is just a wrapper with no information
            var expr = traverseExpr(s, t);
            t.parent();
            return { tag: "expr", expr: expr };
    }
}
exports.traverseStmt = traverseStmt;
function traverseExpr(s, t) {
    switch (t.type.name) {
        case "Number":
            return { tag: "number", value: Number(s.substring(t.from, t.to)) };
        case "VariableName":
            return { tag: "id", name: s.substring(t.from, t.to) };
    }
}
exports.traverseExpr = traverseExpr;
