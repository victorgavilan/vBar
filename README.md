#vBar.js

Progress bar, timer bar, form completion bar...

##Usage
Insert `vbar-min.js` in your web page.  Define the DOM element that will host your bar and that is all.

```html
<body>
  <div id="mybar"></div>
  <form method="post">
    <input type="text" name="name" placeholder="Name">
    <input type="text" name="alias" placeholder="Alias">
    <input type="password" name="password" placeholder="Password">
  </form>

  <script src="vbar-min.js"></script>
  <script>
      //Create the bar
      var myBar = new vBar({
        node: '#mybar'
      });
      
      //Render the bar
      myBar.render();
  </script>
</body>
```

If you want to exclude a field add a class named `ignore` to it. 

To keep formbar filesize small (>4k) `vbar-min.js` file only ships the **solid plugin**. To use another plugin insert **vbar-[pluginName]-min.js** file instead that contains **solid plugin** and the selected plugin. But if you think that you need all the plugins in your page then insert **vbar-all-min.js** file.

##Configuration
vBar have many configuration options that makes easier fits it to your web page design. All this configuration options are accesible through your vBar object too.

 ```javascript
      var myBar = new vBar({
        node: '#mybar',
        colors: ['#F00'],
        totalSteps: 3,
        currentStep: 1
      });
      
      //Access to configuration properties
      myBar.colors = ['#0FF', '#F0F']; 
      myBar.currentStep = 2;
      
      myBar.render();
     
 ```

* **node:** (CSS Selector) DOM node where the bar will be redered.
* **formNode:** (CSS Selector) Form DOM node container. (default: 'body' - observes all page forms fields)
* **barHeight:** (Number) Bar height in pixels. 
* **colors:** (Array of CSS colors) Example: `['#F00', '#0F0','#0FF']`. This colors are share by all plugins, see below the configuration of each plugin to know how it use this colors.
* **colorPercentages:** [Array] Used by some plugins to apply diferent colors in a progress bar at those percentages. It sets the change color points. Example: [10,20,70] will use the first color in the colors array form 0% to 10%, the second from 10% to 20% and the third from 20% to 100% 
**striped** (Boolean) Adds an striped effect to bar color (if plugin supports it).
* **background:** (CSS background) A color or background CSS value. Sets de bar's background.

###Bar border options
 
* **showBorder:** (Boolean value) Show/Hide a border around the bar.
* **borderColor:** (CSS Color) Border color.
* **borderRadius:** (Number) Border radius in pixels (default: 5). Use 50 to create rounded bars.

###Bar text options
* **showText:** (Boolean) Show/Hide the percentage number in the bar.
* **textPendingPercentage:** (Boolean) If true, shows the pending instead the completed percentage.
* **beforeText:** (String) Text to show before the percentage number.
* **afterText:** (String) Text to show after the percentage number.
* **textSize:** (CSS size) Text size. If you pass a number it will represent the size in pixels. 
* **textPosition:** (Number) Defines the text position at the bar. 
    Values: 
    * vBar.TEXTPOS_BOTTOM_CENTER. 
    * vBar.TEXTPOS_BOTTOM_LEFT.
    * vBar.TEXTPOS_BOTTOM_RIGHT.
    * vBar.TEXTPOS_MIDDLE_CENTER. 
    * vBar.TEXTPOS_MIDDLE_LEFT.
    * vBar.TEXTPOS_MIDDLE_RIGHT.
    * vBar.TEXTPOS_TOP_CENTER. 
    * vBar.TEXTPOS_TOP_LEFT.
    * vBar.TEXTPOS_TOP_RIGHT.        
* **textPadding:** (String CSS padding value) Text element padding. If you don't like where the text is positioned adjust it using this value.
* **textColors:** (CSS Color) Text color.

###MultiStep forms
Options if your form have multiple pages or steps.

* **totalSteps:** (Number) Number of steps/pages your form is divided.
* **currentStep:** (Number) Current step/page of your multistep form.

Then you can use the `nextStep()` method to increment currentStep one up.

###Callbacks events
* **onComplete:** (Function) Callback that will be called when the bar is completed.
* **onChange:** (Function) Callback that will be called when the bar change (the percentage change).

###Plugin
* **plugin:** (String) Plugin that you want use to render your bar. Default: 'solid'


##Plugins:

 * [Solid](#)**(default)** - Draw a bar with only one color (the first color in the configuration **colors** array). This is the default option if you don't define any plugin in the configuration object.
 ```javascript
      var myBar = new vBar({
        node: '#mybar',
        colors: ['#F00'],
        plugin: 'solid' //optional. Solid is the default plugin
      });
      
      myBar.render();
 ```
   **Suports striped style**
 
 
 * [Dashed](#)- Same as **solid plugin** but it draws a dashed line instead. You can specify the width and separation between lines. 
 ```javascript
      var myBar = new vBar({
        node: '#mybar',
        colors: ['#F00'],
        plugin: 'dashed'
      });
      
      myBar.render();
 ```
 
 * [Gradient](#) - Draw a bar with a gradient from **colors[0] to colors[1]**.
 ```javascript
      var myBar = new vBar({
        node: '#mybar',
        colors: ['#F00', '#500'],
        plugin: 'gradient'
      });
      
      myBar.render();
 ```
 
 
 * [Sections](#) Draw a bar with multiple sections with different color. Each section take a color from the configuration array colors. 
  ```javascript
      var myBar = new vBar({
        node: '#mybar',
        colors: ['#F00', '#0F0','#00F', '#0FF', '#FF0'],
        plugin: 'sections'
      });
      
      myBar.render();
 ```

    **Suports striped style**

 * [Chameleon](#) - Draw a bar with a solid color that change while it progress. Use all the colors provided by the configuration array colors.
  ```javascript
      var myBar = new vBar({
        node: '#mybar',
        colors: ['#F00', '#FF0', '#0FF'],
        plugin: 'chameleon'
      });
      
      myBar.render();
 ```

    **Suports striped style**
 
 * [Merge](#) - Create two opposite bars with one solid color that grows until they met at the middle. This plugins use colors[0] as the bar color and colors[1] as the mask color. The mask must be the same color as your page background. 
 ```javascript
      var myBar = new vBar({
        node: '#mybar',
        colors: ['#F00', 'white'], //white background
        plugin: 'merge'
      });
      
      myBar.render();
 ```
    **Suports striped style**

##Browser Support
 * Safari 7.0 
 * Opera 21 
 * Mozila Firefox 29 and up
 * Google Chrome 34 and up
 * Internet Exporer 8.0 and up 
 

##License
vBar.js is licensed under the BSD license (http://opensource.org/licenses/BSD-3-Clause)

##Acknowledgements
[**Fort.js**](http://idriskhenchil.me/fort) To inspirate this project. 
