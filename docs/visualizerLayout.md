
# Visualizer layout

## Top-level elements

The top-level visual components of the visualizers are
- **header**: a title showing the visualizer type and the group, such as "Cayley Diagram for <i>D</i><sub>4</sub>"
- **horiz-container**: a flex container to arrange the components of the visualizer other than the header
- **graphic**: the major component of the visualizer, a large graphic depicting the group according to the type of visualization
- **splitter**: a thin bar to the right of the graphic; grab the splitter with the mouse to resize the graphic
- **vert-container**: a flex container to arrange the controls and the help/reset buttons into a vertical stack
- **controls**: functions to modify the visualization, such as modifying their arrangement or highlighting a subset
- **help-reset**: buttons with the obvious functions

These visual components are outlined in the following HTML snippet:

```html
<body class="vert">
   <div id="header" class="horiz">Header</div>
   <div id="horiz-container" class="horiz">
      <div id="graphic"></div>
      <div id="splitter"></div>
      <div id="vert-container" class="vert">
         <div id="controls"></div>
         <div id="help-reset" class="horiz">
            <button id="help">Help</button>
            <button id="reset">Reset</button>
         </div>
      </div>
   </div>
</body>
```

## Graphical layout
     
Visualizers all have the same basic graphical layout:

  ![layout](./visualizerLayout.png "Visualizer layout")

The elements may be identified in this diagram from their borders according to the following key:

  ![layout_key](./visualizerLayoutKey.png "Visualizer color key")
  
## CSS

The following CSS (from [visualizer.css](../style/visualizer.css)) formats the elements and styles them to fit the page, as described in the embedded comments:

```css
<style>
/* causes web page to fill the window */
body {
   margin: 0;
   height: 100%;
   width: 100%;
}

/* provides a common button appearance across visualizers */
button {
   -webkit-appearance: none;
   background-color: #FFFFFF;
   border: 1px solid #A4A4A4;
   height: 30px;
   font-size: 14pt;
}
button:focus {
   outline: 0;
}

/* identifies vertical and horizontal flex containers */
.vert {
   display: flex;
   flex-direction: column;
}
.horiz {
   display: flex;
   flex-direction: row;
}

/* header format, like <H1> in a graphical context */
#header {
   background-color: #D0D0D0;
   justify-content: center;
   align-items: center;
   font-size: 40px;
   height: 60px;
   flex: 0 1 60px;
}

/* horizontal container for everything but the header; stretches to fill the height available */
#horiz-container {
   flex: 1 1 auto;
   height: 100%;
   xtouch-action: none;   /* for splitter */
}

/* container for main graphic, generally a <canvas>; flexes to fill the width available */
#graphic {
   flex: 1 1 auto;
   background-color: #E8C8C8;
   width: 100%;
}

/* grab here to resize graphic; changes cursor */
#splitter {
   flex: 0 0 auto;
   width: 8px;
   background: #ECECEC;
   cursor: col-resize;
}

/* container for arranging visualizer-specific controls and the help/reset buttons in vertical stack */
#vert-container {
   flex: 1 1 auto;
   width: 400px;
}

/* container for visualizer-specific controls */
#controls  {
   flex: 1 1 auto;
   background-color: #F0E68C;
}

/* container to hold help and reset buttons */
#help-reset {
   justify-content: space-around;
   align-items: center;
   height: 44px;
}

/* styles help and reset buttons */
#help-reset > button {
   width: 48%;
   -webkit-appearance: none;
   background-image: linear-gradient(#F6F6F6, #C0C0C0);
   border: 1px solid #7E7E7E;
   height: 30px;
   font-size: 14pt;
}
</style>
```