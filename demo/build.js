(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/yutakahoulette/marbles/demo/index.js":[function(require,module,exports){
var textToMarbles = require('../index.js')

var textarea = document.getElementsByTagName('textarea')[0]
var marbles = document.getElementsByTagName('figure')[0]

textarea.oninput = draw 

function draw(e) {
  marbles.innerHTML = e.target.value
  textToMarbles(marbles)
}

marbles.innerHTML = textarea.value

textToMarbles(marbles)


},{"../index.js":"/Users/yutakahoulette/marbles/index.js"}],"/Users/yutakahoulette/marbles/index.js":[function(require,module,exports){
// takes a DOM element or selector string
function init(elOrSelector, config) {
  if(!elOrSelector) {
    return false
  }
  if(typeof elOrSelector === 'string') {
    document.querySelectorAll(elOrSelector)
      .forEach(textToMarbles(config))
  } 
  else {
    textToMarbles(config)(elOrSelector)
  }
}

function textToMarbles(config) {
  return function(el) {
    el.style.visibility = 'hidden'
    var rows = textToRows(el)
    el.innerHTML = ''
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var fullWidth = getInnerWidth(el) - 15
    var unitSize = fullWidth / longestRow(rows)
    var colors = config && config.colors || ['#5f8ace', '#d4c52e', '#77a66f', '#a7784e']
    canvas.width = fullWidth
    canvas.height = unitSize  * rows.length * 1.2
    draw(rows, ctx, fullWidth, unitSize, colors)
    el.appendChild(canvas)
    el.style.visibility = 'visible'
  }
}

function longestRow(rows) {
  return rows.reduce(function(a, b) {
    if(typeof b === 'string' || a.length >= b.length) return a
    return b
  }, []).length + 1
}

function textToRows(el) {
  return el.textContent
    .trim()
    .split('\n')
    .map(formatRow)
}

function formatRow(s) {
  s = s.trim()
  if(s.charAt(0) === '#') return s.substr(1).trim()
  return s.replace(/ +?/g, '').split(',')
}

function getInnerWidth(el) {
  var width = el.clientWidth
  var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle
  width -= style.paddingLeft ? parseInt(style.paddingLeft) : 0
  width -= style.paddingRight ? parseInt(style.paddingRight) : 0
  return width
}

function draw(rows, ctx, fullWidth, unitSize, colors) {
  rows.map(function(row, i) {
    var y = (i + 0.5) * unitSize * 1.2
    if(typeof row === 'string') {
      return text(ctx, row, y, unitSize, fullWidth)
    }
    horizontalLine(ctx, y, fullWidth, unitSize)
    triangle(ctx, y, fullWidth)
    marbles(ctx, row, rows, y, i, unitSize, colors)
  })
}

function text(ctx, row, y, unitSize, fullWidth) {
  var fontSize = unitSize * 0.35
  ctx.font =  fontSize + 'px monospace'
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black' 
  ctx.fillText(row, fullWidth / 2 + fontSize, y)
}

function horizontalLine(ctx, y, fullWidth) {
  ctx.beginPath()
  ctx.moveTo(0, y)
  ctx.lineTo(fullWidth, y)
  ctx.lineWidth = 1
  ctx.strokeStyle = 'grey' 
  ctx.closePath()
  ctx.stroke()
}

function triangle(ctx, y, fullWidth) {
  ctx.beginPath()
  ctx.moveTo(fullWidth, y)
  ctx.lineTo(fullWidth - 8, y + 5)
  ctx.lineTo(fullWidth - 8, y - 5)
  ctx.fillStyle = 'grey'
  ctx.fill()
}

function marbles(ctx, row, rows, y, i, unitSize, colors) {
  var radius = unitSize / 2 
  var x = 0
  if(typeof rows[i-1] === 'string') i-- 
  row.map(function(unit) {
    x += unitSize 
    if(unit && unit != '|') {
      // draw circles
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
      ctx.fillStyle = colors[i % colors.length] 
      ctx.fill()      
    }
    if(unit) {
      var fontSize = unitSize * 0.45 
      ctx.font =  fontSize + 'px monospace'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillStyle = unit != '|' ? 'white' : 'grey'
      ctx.fillText(unit, x, y)
    }
  })
}

module.exports = init


},{}]},{},["/Users/yutakahoulette/marbles/demo/index.js"]);
