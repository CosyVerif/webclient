/*
 *  COSIVERIF JAVASCRIPT WEB CLIENT
 */
    var rect_size = 30,
        rect_highlighted = 40,
        radius = rect_size / 2;
        radis_highlighted = (rect_size / 1.2);
    /* 
     * This object contains the d attribute of the path that later will come part of the force layout.
     * The shapes are defined so that the (0,0) is the center of each one. 
     */
    var shapes = {
        rect : "M " + -rect_size + " " + (-rect_size / 4) + " h " + 2 * rect_size + " v " + (rect_size / 2) + " h "+ (-2 * rect_size) + " z",
        rect_highlighted : "M " + -rect_highlighted + " " + (-rect_highlighted / 4) + " h " + 2 * rect_highlighted + " v " + (rect_highlighted / 2) + " h "+ (-2 * rect_highlighted) + " z",
        vertical_rect : "M " + (-rect_size / 4) + " " + -rect_size + " h " + (rect_size / 2) + " v " + 2 * rect_size + " h "      + (-rect_size / 2) + " z",
        circle : "M 0 0 m" + (-radius) +", 0 a " + radius + "," + radius + " 0 1,0 " + (radius * 2) +",0 " 
                        + "a " + radius + "," + radius + " 0 1,0 " + (-radius * 2) + ",0",
        circle_highlighted : "M 0 0 m" + (-radis_highlighted) +", 0 a " + radis_highlighted + "," + radis_highlighted + " 0 1,0 " + (radis_highlighted * 2) +",0 " + "a " + radis_highlighted + "," + radis_highlighted + " 0 1,0 " + (-radis_highlighted * 2) + ",0"
        };

    var element = {}
    
    var margin = {top: -5, right: -5, bottom: -5, left: -5},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        markerWidth = 8,
        markerHeight = 8,
        refX = radius + markerWidth,
        origin = {x: width/2, y: height/2};

    /*
     * @index_* = stores the index of the element for easier access
     */
    var nodes_index = {},
        links_index = {}.
        forms_index = {};
        
    var force = d3.layout.force()
        .size([width, height])
        .nodes([])
        .links([])
        .gravity(0)
        .linkDistance(300)
        .on("tick", tick);
                
    //~ var drag = force.drag().on("dragstart", dragstart);
    
    // We start to append elements to the original html.
    
    var svg = d3.select("#model_container").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("stroke", "black");
    
    d3.select("#model_container").append("div")
        .attr("id", "forms_group")
        .attr("class", "span5");
        
    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", refX)
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
        

    var path = svg.append("svg:g").selectAll("path"),
        node = svg.append("svg:g").selectAll(".node"),
        circle = svg.append("svg:g").selectAll("g"),
        text = svg.append("svg:g").selectAll("g");

/*
 * Function definitions
 */
    function add_node (node) {
        if(node.get("type") == "arc"){
            console.log ("Adding " + node.get("name") + " " + node.get("type"));
            var source = node.get('source').get('name'),
                target = node.get('target').get('name'),
                valuation = node.get('validation');
                                    
            source = force.nodes()[nodes_index[source]];
            target = force.nodes()[nodes_index[target]];
            
            force.links().push({source: source, target: target, type: "licensing"});
            links_index[source.name + ',' + target.name] = force.links().length - 1;
        } else if("place" == node.get("type") || "transition" == node.get("type")){
            console.log ("Adding " + node.get("name") + " " + node.get("type"));
            marking = node.get('marking') ? node.get('marking') : '';
            highlighted = node.get('highlighted') ? node.get('highlighted') : '';
            selected = node.get('selected') ? node.get('selected') : '';
            // We get the shape
            isTransition = node.get("type") == "transition";
            if(highlighted)
                shape = isTransition? shapes.rect_highlighted : shapes.circle_highlighted;
            else
                shape = isTransition? shapes.rect : shapes.circle;
            
            var s = node.get("position"),
                p = s.indexOf(":");
            
            var h = s.substring(0, p),
                angle = s.substring(p+1);
            
            var x_pos = origin.x + Math.cos(angle) * h;
            var y_pos = origin.y + Math.sin(angle) * h;
            elem = {name : node.get('name'),
                    type : node.get("type"), 
                    shape : shape,
                    marking : marking ? true : false,
                    px : x_pos,
                    py : y_pos,
                    highlighted : highlighted,
                    selected : selected,
                    fixed : true,
                    lua_node :node};
            force.nodes().push(elem);
            //~ console.log("add_node " + force.nodes())
            nodes_index[node.get('name')] = force.nodes().length - 1;
        } else if("form" == node.get("type")){
            var unsorted_forms = elements(node);
            var form_elems = [];
            for(j = 1; j <= count(unsorted_forms); j++){
                form_elems.push(unsorted_forms.get(j));
            }
            form_elems.sort(function sortForms(x, y) {
                if("text" == x.get("type"))
                    return -1;
                if(y_value = "text" == y.get("type"))
                    return 1;
                return 0;
            });
            
            var form_id = "form" + node.get("name");
            
            d3.select("#forms_group").append("div")
                    .attr("id", form_id)
                    .attr("class", "lua_form");
                                    
            var selection = d3.select("#"+form_id);
            
            for(j = 0; j < count(form_elems); j++){
                form = form_elems[j];
                if("text" == form.get("type")){
                    selection.append("h4")
                        .text(form.get("name"));
                    selection.append("input").data([form])
                        .attr("type", "text")
                        .attr("size", 9)
                        .on("change", formTextChange)
                        .attr("value", form.get("value"));                        
                } else if("button" == form.get("type")) {
                    btn = selection.append("button").data([form]);
                    btn.attr("type", "button")
                        .attr("class", "btn btn-success")
                        .on("click", formBtnClick)
                        .text(form.get("name"));
                    if(!form.get("is_active")){
                        btn.attr("disabled", "true")
                    }
                }
            }
        }
        updateForceLayout();
    }

    function remove_node (node) {
        console.log ("Removing node or arc: " + node.get("name"));
        var i, j;
        if(node.get("type") == "arc"){
            var source = node.get('source').get('name'),
                target = node.get('target').get('name');
                
            i = links_index[source + ',' + target];
            force.links().splice(i, 1);
            
            delete links_index[source + ',' + target];
            
        } else if(node.get("type") == "place" || node.get("type") == "transition"){
            i = nodes_index[current_model.get('name')];
            force.nodes().splice(i, 1);
            
            delete nodes_index[current_model.get('name')];
        }
        updateForceLayout();
    }

    function update_node (node) {
        var i ,j;
        if(node.get("type") == "arc"){
            //~ var source = node.get('source').get('name'),
                //~ target = node.get('target').get('name'),
                //~ valuation = node.get('validation');
            //~ i = links_index[source.name + ',' + target.name];
            //~ 
            //~ force.links()[i]({source: source, target: target, type: "licensing"});
            //~ 
        } else if("place" == node.get("type") || "transition" == node.get("type")){
            console.log ("Updating  " + node.get("name") + " " + node.get("type"));
            marking = node.get('marking') ? node.get('marking') : '';
            highlighted = node.get('highlighted') ? node.get('highlighted') : '';
            selected = node.get('selected') ? node.get('selected') : '';

            // We get the shape
            isTransition = node.get("type") == "transition";
            if(highlighted)
                shape = isTransition? shapes.rect_highlighted : shapes.circle_highlighted;
            else
                shape = isTransition? shapes.rect : shapes.circle;
            
            var s = node.get("position"),
                p = s.indexOf(":");
            
            var h = s.substring(0, p),
                angle = s.substring(p+1);
            
            var x_pos = origin.x + Math.cos(angle) * h;
            var y_pos = origin.y + Math.sin(angle) * h;

            elem = {name : node.get('name'),
                    type : node.get("type"),
                    selected : selected,
                    shape : shape,
                    marking : marking ? true : false,
                    px : x_pos,
                    py : y_pos,
                    highlighted : highlighted,
                    fixed : true,
                    lua_node :node};
            
            i = nodes_index[node.get('name')];
            force.nodes()[i] = elem;
        } else if("form" == node.get("type")){
            var unsorted_forms = elements(node);
            var form_elems = [];
            for(j = 1; j <= count(unsorted_forms); j++){
                form_elems.push(unsorted_forms.get(j));
            }
            form_elems.sort(function sortForms(x, y) {
                if("text" == x.get("type"))
                    return -1;
                if(y_value = "text" == y.get("type"))
                    return 1;
                return 0;
            });
            
            var form_id = "form_"+node.get("name");
            d3.select("#forms_group").append("div")
                    .attr("id", form_id)
                    .attr("class", "lua_form");
                                    
            var selection = d3.select("#"+form_id);
            
            for(j = 0; j < count(form_elems); j++){
                form = form_elems[j];
                if("text" == form.get("type")){
                    selection.append("h4")
                        .text(form.get("name"));
                    selection.append("input").data([form])
                        .attr("type", "text")
                        .attr("size", 9)
                        .on("change", formTextChange)
                        .attr("value", form.get("value"));                        
                } else if("button" == form.get("type")) {
                    btn = selection.append("button").data([form]);
                    btn.attr("type", "button")
                        .attr("class", "btn btn-success")
                        .on("click", formBtnClick)
                        .text(form.get("name"));
                    if(!form.get("is_active")){
                        btn.attr("disabled", "true")
                    }
                }
            }
        }
        updateForceLayout();
    }
    
    function websocket (url) {
        console.log ("new websocket: " + url);
        return new WebSocket (url, "cosy");
    }
    /*
     * Update the model with the values stored in global WINDOW
     * from Lua Code
     */
    function updateModel(input_model){
        // We get all the nodes
                
        var temp_links = [];
        var nodes = force.nodes(),
            links = force.links();
        
        var elems = elements(input_model);
        for(i = 1; i <= count(elems); i++){
            current_model = elems.get(i);
            //~ console.log("Element Type: " + current_model.get("type"));
            if("arc" == current_model.get("type")){
                arc = { source : current_model.get('source').get('name'),
                        target : current_model.get('target').get('name'),
                        valuation : current_model.get('validation'),
                        type : current_model.get("type")};
                temp_links.push(arc);
            } else if("place" == current_model.get("type") || "transition" == current_model.get("type")){
                marking = current_model.get('marking') ? current_model.get('marking') : '';
                highlighted = current_model.get('highlighted') ? current_model.get('highlighted') : '';
                selected = current_model.get('selected') ? node.get('selected') : '';
                
                // We get the shape
                isTransition = current_model.get("type") == "transition";
                if(highlighted)
                    shape = isTransition? shapes.rect_highlighted : shapes.circle_highlighted;
                else
                    shape = isTransition? shapes.rect : shapes.circle;
                
                //~ var rx = /\d+/,
                    //~ ry = /[0-9]*[.][0-9]+$/;
                    
                var s = current_model.get("position"),
                    p = s.indexOf(":");
                
                var h = s.substring(0, p),
                    angle = s.substring(p+1);
                
                //~ console.log("H :" + h + " ANGLE : " + angle);
                var x_pos = origin.x + Math.cos(angle) * h;
                var y_pos = origin.y + Math.sin(angle) * h;
                
                //~ console.log("Offset X :" + Math.cos(angle) * h + " Offset Y : " + Math.sin(angle) * h);
                //~ console.log("Coordinates X :" + x_pos + " Y : " + y_pos);
                
                elem = {name : current_model.get('name'),
                        type : current_model.get("type"), 
                        shape : shape,
                        marking : marking ? true : false,
                        px : x_pos,
                        py : y_pos,
                        highlighted : highlighted,
                        selected : selected,
                        fixed : true,
                        lua_node :current_model};            
                nodes.push(elem);
                nodes_index[current_model.get('name')] = nodes.length - 1;
            } else if("form" == current_model.get("type")){
                
                var unsorted_forms = elements(current_model);
                var form_elems = [];
                
                for(j = 1; j <= count(unsorted_forms); j++){
                    form_elems.push(unsorted_forms.get(j));
                }
                
                form_elems.sort(function sortForms(x, y) {
                    if("text" == x.get("type"))
                        return -1;
                    if(y_value = "text" == y.get("type"))
                        return 1;
                    
                    return 0;
                });
                var form_id = "form"+i;
                
                d3.select("#forms_group").append("div")
                        .attr("id", form_id)
                        .attr("class", "lua_form");
                                        
                var selection = d3.select("#"+form_id);
                
                for(j = 0; j < count(form_elems); j++){
                    form = form_elems[j];
                    
                    if("text" == form.get("type")){
                        selection.append("h4")
                            .text(form.get("name"));
                        selection.append("input").data([form])
                            .attr("type", "text")
                            .attr("size", 9)
                            .on("change", formTextChange)
                            .attr("value", form.get("value"));                        
                    } else if("button" == form.get("type")) {
                        btn = selection.append("a").data([form]);
                        btn.attr("href", "#")
                            .attr("class", "btn btn-success")
                            .on("click", formBtnClick)
                            .text(form.get("name"));
                        if(!form.get("is_active")){
                            btn.attr("disabled", "true")
                        }
                    }
                }
            }
        }
        
        var source, target;
        
        /* Create a proper link array for the force layout
         */ 
        for(j = 0; j < temp_links.length; j++) {
            l = temp_links[j];
            
            source = nodes[nodes_index[l.source]];
            target = nodes[nodes_index[l.target]];
            if(undefined === links_index[source.name + ',' + target.name]){
                links.push({source: source, target: target, type: "licensing"});
                links_index[source.name + ',' + target.name] = links.length - 1;
            } else {
                pos = links_index[source.name + ',' + target.name];
                links[pos].source = source;
                links[pos].target = target;
                links[pos].type = "licensing";
            }
        }
        updateForceLayout();
    }
    
    function updateForceLayout() {
        console.log("Updateforcelayout = " + force.nodes())
        //~ We update the force layout data. 
        path = path.data(force.links(), function(d){ return d.source.name +','+ d.target.name});
        
        path.enter().insert("svg:path", ".node");
        path.attr("class", function (d) {return "link " + d.type;})
            .attr("marker-end", function (d) {return "url(#" + d.type + ")";});
        path.exit().remove();
        
        node = node.data(force.nodes(), function (d) {console.log(d.name);return d.name;});
        node.enter().append("path");
        node.attr("class", "node")
            .attr("d", function(d){ return d.shape;})
            .attr("fill", function(d){ return d.highlighted ? "gold" : "#ccc"})
            .on("dblclick", dblclick)
            .on("click", click)
            .call(force.drag);
        
        node.exit().remove();
        
        circle = circle.data(force.nodes(), function (d) {return d.name;});
        circle.enter().append("circle")
                .attr("class", "token")
                .attr("r", radius/6)
                .attr("fill", "black")
                .call(force.drag);
                                
        circle.attr("visibility", function(d) {return d.marking ? "visible" : "hidden" })
        
        circle.exit().remove();

        text = text.data(force.nodes(), function (d) {return d.name;});
        text.enter().append("text")
            .attr("x", function(d){ return d.type == 'transition' ? 45 : 30})
            .attr("y", ".45em")
            .attr("size", 10);
        text.text(function(d) { return d.name; });
        text.exit().remove();
        
        force.start();
        
        return true;
    }
    
    function dblclick(d) {
        d.lua_node.set("selected", false);
        
        d3.select(this).classed("fixed", d.fixed = false);
    }
    
    function click(d){
        d.lua_node.set("selected", true);
        
        d3.select(this).classed("fixed", d.fixed = true);
    }
    
    function formBtnClick(d){
        d.set("clicked", true);
    }
    
    function formTextChange(d){
        d.set("value", this.value);
    }
        
    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = (d.target.y - d.source.y),
                dr = Math.sqrt(dx * dx + dy * dy);
            /* 
             * TODO: Change this harcoded array
             */
            
            var link_shapes = {
                "licensing": "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y,
                "resolved": "M" + d.source.x + "," + d.source.y + "H" + d.target.x + " V " + d.target.y, 
                "elliptic": "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," +   d.target.y };
        
            return link_shapes[d.type];
        });

        node.attr("transform", transform);
        circle.attr("transform", transform);
        text.attr("transform", transform);
        
        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }
    }

    //~ function typeToString(n){
        //~ var ret = null;
        //~ if(type_place.toString() == n.toString())
            //~ ret = 'place';
        //~ else if(type_trans.toString() == n.toString())
            //~ ret = 'transition';
        //~ else if(type_arc.toString() == n.toString())
            //~ ret = 'arc';
        //~ return ret;
    //~ }
    
    function startUpdateTimer(){
        //~ setInterval(/*Some Function to check updates*/)
    }
    
    function testUpdateElems() {
        setTimeout(function() {
              links.pop();  
              nodes[0].marking = false;
              updateForceLayout();
            }, 3000);
    }
    
    function testRemoveElems() {
        setTimeout(function() {
            console.log('Removed called');
            var i = nodes_index['p_nil'];
            force.nodes().splice(i, 1);
            updateForceLayout();
            }, 3000);
    }
