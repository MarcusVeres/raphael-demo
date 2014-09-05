window.onload = function() {

    // Global
    var R = Raphael("canvas", 800, 600);
    var current_object = 'none';
    var id_counter = 0;
    var current_key = 'none';

    // -------------------------------------------------------------------------
    // Keydown Listeners

    $(window).keydown(function(event){
        // alert(event.keyCode);
        current_key = event.keyCode;
    });

    $(window).keyup(function(event){
        current_key = 'null';
    });

    // -------------------------------------------------------------------------
    // Updates the sidebar with the object properties

    function updateProperties()
    {
        var attrs = current_object.attrs;

        // console.log("calling: ", current_object);
        // console.log("width: ", attrs.width);
        // console.log("height: ", attrs.height);
        // console.log("x position: ", attrs.x);
        // console.log("y position: ", attrs.y);

        $('#sidebar input[name="id"]').val(current_object.id);
        $('#sidebar input[name="width"]').val(attrs.width);
        $('#sidebar input[name="height"]').val(attrs.height);
        $('#sidebar input[name="x-pos"]').val(attrs.x);
        $('#sidebar input[name="y-pos"]').val(attrs.y);
    }

    // -------------------------------------------------------------------------
    // Create an object function

    function Element( data ) 
    {

        // ---------------------------------------------------------------------
        // Stripping data from the data object
        var image       = ((data.image) ? data.image : 'placeholder.svg');
        var x_pos       = ((data.x_pos) ? data.x_pos : 0);
        var y_pos       = ((data.y_pos) ? data.y_pos : 0);
        var width       = ((data.width) ? data.width : 100);
        var height      = ((data.height) ? data.height : 100);

        // ---------------------------------------------------------------------
        // Properties
        this.exs = 0;
        this.why = 0;

        // ---------------------------------------------------------------------
        // Graphic Image
        this.graphic =  R.image( image, x_pos, y_pos, width, height ).attr({
                            fill: "#aaa",
                            stroke: "none",
                            opacity: 1
                        });

        // assign a variable name based on the counter
        var _id = "element-" + id_counter;
        this.graphic.node.setAttribute("id",_id);

        // update the counter to prevent duplicates
        id_counter++;

        // ---------------------------------------------------------------------
        // Bounding Box
        this.bounding = R.rect( x_pos, y_pos, width, height ).attr({
                            fill: "#fafafa",
                            opacity: .2,
                            cursor: "move"
                        });
        this.bounding.node.setAttribute("class","rect");

        // ---------------------------------------------------------------------
        // Resize Square
        this.resize =   R.rect( (x_pos + width - 20) , (y_pos + height - 20) , 20 , 20 ).attr({
                            fill: "#ddd",
                            stroke: "none",
                            opacity: .5
                        });

        // ---------------------------------------------------------------------
        // initialize the element (call the right functions)
        this.call( this );
        this.init( this );

    }

    // -------------------------------------------------------------------------
    // Original Methods

    Element.prototype.start = function () {
        // storing original coordinates
        this.ox = this.attr("x");
        this.oy = this.attr("y");
        this.attr({opacity: 0.8});

        this.sizer.ox = this.sizer.attr("x");
        this.sizer.oy = this.sizer.attr("y");
        this.sizer.attr({opacity: 1});

        this.img.ox = this.img.attr("x");
        this.img.oy = this.img.attr("y");
        this.img.attr({opacity: 1});
    },
    Element.prototype.move = function (dx, dy) {
        // move will be called with dx and dy
        this.attr({x: this.ox + dx, y: this.oy + dy});
        this.sizer.attr({x: this.sizer.ox + dx, y: this.sizer.oy + dy});
        this.img.attr({x: this.img.ox + dx, y: this.img.oy + dy});
        // SIDEBAR
        updateProperties();
    },
    Element.prototype.hover = function () {
        this.attr({opacity: 0.7});
        // SIDEBAR
        current_object = this;
        updateProperties();
    },
    Element.prototype.hout = function () {
        this.attr({opacity: 0.2});
    },
    Element.prototype.up = function () {
        // restoring state
        this.attr({opacity: .3});
        this.sizer.attr({opacity: .5});
        this.img.attr({opacity: 1});
        // SIDEBAR
        updateProperties();
    },
    Element.prototype.rstart = function () {
        // storing original coordinates
        this.ox = this.attr("x");
        this.oy = this.attr("y");

        this.box.ow = this.box.attr("width");
        this.box.oh = this.box.attr("height");
        this.box.img.ow = this.box.attr("width");
        this.box.img.oh = this.box.attr("height");
    },
    Element.prototype.rmove = function (dx, dy) {
        // Check for SHIFT (16)
        if( current_key != 16 ){
            // move will be called with dx and dy
            this.attr({x: this.ox + dx, y: this.oy + dy});
            this.box.attr({width: this.box.ow + dx, height: this.box.oh + dy});
            this.box.img.attr({width: this.box.ow + dx, height: this.box.oh + dy});
        } else {
            // uniform scaling

            // get the ratio
            var ratio = this.attrs.height / this.attrs.width;

            // transformations
            console.log(this.box.oh);

            // this.attr({x: this.ox + dx, y: this.oy + dx * ratio}); // WRONG
            this.box.attr({width: this.box.ow + dx, height: this.box.oh + dx * ratio});
            this.box.img.attr({width: this.box.ow + dx, height: this.box.oh + dx * ratio});
        }
        // SIDEBAR
        updateProperties();
    };

    // -------------------------------------------------------------------------
    // Custom Methods

    Element.prototype.shift = function(x, y) {
        this.exs += x;
        this.why += y;
        console.log("shape is moving by: " , x , " | " , y);
        console.log("shape is now at: " , this.exs , " | " , this.why);
    };

    Element.prototype.call = function(object) {
        console.log("Initalized Object: ", object.graphic.id);
    }

    Element.prototype.init = function( element ) {
        this.bounding.drag( this.move, this.start, this.up );
        this.bounding.hover( this.hover, this.hout );
        this.bounding.img = this.graphic;
        this.graphic.box = this.bounding;
        // 
        this.bounding.sizer = this.resize;
        this.resize.drag( this.rmove , this.rstart );
        this.resize.box = this.bounding;
    };

    // 

    var test = new Element({
        'image'     : 'play.svg',
        'x_pos'     : 100,
        'y_pos'     : 100,
        'width'     : 200,
        'height'    : 200
    });

    var test2 = new Element({
        'x_pos'     : 50,
        'y_pos'     : 100,
        'width'     : 50,
        'height'    : 100
    });

    var test2 = new Element({
        'x_pos'     : 300,
        'y_pos'     : 50,
        'width'     : 50,
        'height'    : 50
    });

    // var test2 = new Element('play.svg',100,100,200,200);
    // var test3 = new Element('play.svg',50,50,100,100);

    return;

};
