
    // Size definitions for the shapes
    var rect_size = 30,
        rect_highlighted = 40,
        radius = rect_size / 2;
        radis_highlighted = (rect_size / 1.2);
    
    // Definitions of each of the shapes represented in the force layout.
    // Each new shape must be defined here

    var shapes = {
        rect : "M " + -rect_size + " " + (-rect_size / 4) + " h " + 2 * rect_size + " v " + (rect_size / 2) + " h "+ (-2 * rect_size) + " z",
        rect_highlighted : "M " + -rect_highlighted + " " + (-rect_highlighted / 4) + " h " + 2 * rect_highlighted + " v " + (rect_highlighted / 2) + " h "+ (-2 * rect_highlighted) + " z",
        vertical_rect : "M " + (-rect_size / 4) + " " + -rect_size + " h " + (rect_size / 2) + " v " + 2 * rect_size + " h "      + (-rect_size / 2) + " z",
        circle : "M 0 0 m" + (-radius) +", 0 a " + radius + "," + radius + " 0 1,0 " + (radius * 2) +",0 " 
                        + "a " + radius + "," + radius + " 0 1,0 " + (-radius * 2) + ",0",
        circle_highlighted : "M 0 0 m" + (-radis_highlighted) +", 0 a " + radis_highlighted + "," + radis_highlighted + " 0 1,0 " + (radis_highlighted * 2) +",0 " + "a " + radis_highlighted + "," + radis_highlighted + " 0 1,0 " + (-radis_highlighted * 2) + ",0"
        };

    // Position definitions and points of reference for the markers
    var margin = {top: -5, right: -5, bottom: -5, left: -5},
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        markerWidth = 8,
        markerHeight = 8,
        refX = radius + markerWidth,
        origin = {x: width/2, y: height/2};
        
    // The force layout from D3 is the graphical representation of the
    // model. Set gravity in 0 so that the nodes dont move in the graph and linkDistance 
    // in 300 to adjust any node without inicial position
    
    var force = d3.layout.force()
        .size([width, height])
        .nodes([])
        .links([])
        .gravity(0)
        .linkDistance(200)
        .on("tick", tick);
        
    var drag = force.drag()
        .on("dragend", dragEnd);
                    
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
        
    // Definitions of all the elements from the force layot.
    // the circle represents a token for each node. 
    var path = svg.append("svg:g").selectAll("path"),
        node = svg.append("svg:g").selectAll(".node"),
        circle = svg.append("svg:g").selectAll("g"),
        text = svg.append("svg:g").selectAll("g");
        
    var nodes_index = {},
        links_index = {}.
        forms_index = {};

    // Add new node from the model 
    function add_node(node){
        updateModelNode(node);
    }
    
    // Update a previous existing node in the model
    function update_node (node) {
        updateModelNode(node);
    }
    
    function updateModelNode (node) {
        if(node.get("type") == "arc"){
            var source = node.get('source'),
                target = node.get('target'),
                valuation = node.get('validation');
            
            source = force.nodes()[nodes_index[id(source)]];
            target = force.nodes()[nodes_index[id(target)]];
            
            if(!source || !target) return;
            
            if(undefined == links_index[id(node)]){
                force.links().push({id : id(node), source: source, target: target, type: "licensing"});
                links_index[id(node)] = force.links().length - 1;
            }
            else{
                force.links()[i].source = source;            
                force.links()[i].target = target;    
            }
        } else if("place" == node.get("type") || "transition" == node.get("type")){
            
            marking = node.get('marking') ? node.get('marking') : '';
            highlighted = node.get('highlighted') ? node.get('highlighted') : '';
            selected = node.get('selected') ? node.get('selected') : '';
            name = node.get('name') ? node.get('name') : '';

            isTransition = node.get("type") == "transition";
            if(highlighted)
                shape = isTransition? shapes.rect_highlighted : shapes.circle_highlighted;
            else
                shape = isTransition? shapes.rect : shapes.circle;
            
            var s = node.get("position"),
                p = s.indexOf(":");
            
            var h = s.substring(0, p),
                angle = s.substring(p+1);
                
            var x_pos = origin.x + Math.cos(angle*(180/Math.PI)) * h;
            var y_pos = origin.y + Math.sin(angle*(180/Math.PI)) * h;

            elem = {id : id(node),
                    name : name,
                    type : node.get("type"), 
                    shape : shape,
                    marking : marking ? true : false,
                    px : x_pos,
                    py : y_pos,
                    highlighted : highlighted,
                    selected : selected,
                    fixed : true,
                    lua_node :node};
            if(undefined == nodes_index[id(node)]){
                force.nodes().push(elem);
                nodes_index[id(node)] = force.nodes().length - 1;
            } else {
                i = nodes_index[id(node)];
                force.nodes()[i].id = elem.id;
                force.nodes()[i].name = elem.name;
                force.nodes()[i].type = elem.type;
                force.nodes()[i].shape = elem.shape;
                force.nodes()[i].marking = elem.marking;
                force.nodes()[i].px = elem.px;
                force.nodes()[i].py = elem.py;
                force.nodes()[i].highlighted = elem.highlighted;
                force.nodes()[i].fixed = elem.fixed;
                force.nodes()[i].selected = elem.selected;
                force.nodes()[i].lua_node = elem.lua_node;
            }
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
            
            var selection = d3.select("#forms_group");
            var data = selection.data();
            data[id(node)] = node;
            selection = selection.data(data, function(d) { return id(node)});
            
            selection.enter().append("div")
                    .attr("id", id(node))
                    .attr("class", "lua_form");
            
            for(j = 0; j < count(form_elems); j++){
                form = form_elems[j];
                sub_id = id(form);
                if("text" == form.get("type")){
                    selection.append("h4")
                        .attr("id", sub_id+"_h4")
                        .text(form.get("name"));
                    selection.append("input").data([form])
                        .attr("id", sub_id+"_text")
                        .attr("type", "text")
                        .attr("size", 9)
                        .on("change", formTextChange)
                        .attr("value", form.get("value"));
                } else if("button" == form.get("type")) {
                    btn = selection.append("button").data([form]);
                    btn.attr("type", "button")
                        .attr("id", sub_id)
                        .attr("class", "btn btn-success")
                        .attr("data-toggle", "button")
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

    // A node has been removed from the model, so it needs to be deleted
    // in the layout
    function remove_node (node) {
        console.log("REMOVE");
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
    
    function websocket (url) {
        console.log ("new websocket: " + url);
        return new WebSocket (url, "cosy");
    }
    
    function add_patch (str) {
    }
    
    // GUI update
    function updateForceLayout() {
        path = path.data(force.links(), function(d){return d.id});
        
        path.enter().insert("svg:path", ".node");
        path.attr("class", function (d) {return "link " + d.type;})
            .attr("marker-end", function (d) {return "url(#" + d.type + ")";});
        path.exit().remove();
        
        node = node.data(force.nodes(), function (d) {return d.id});
        node.enter().append("path");
        node.attr("class", "node")
            .attr("d", function(d){ return d.shape;})
            .attr("fill", function(d){ return d.highlighted ? "gold" : "#ccc"})
            .on("dblclick", dblclick)
            .on("click", click)
            .call(drag);
        
        node.exit().remove();
        
        circle = circle.data(force.nodes(), function (d) {return d.id;});
        circle.enter().append("circle")
                .attr("class", "token")
                .attr("r", radius/6)
                .attr("fill", "black")
                .call(force.drag);
                                
        circle.attr("visibility", function(d) {return d.marking ? "visible" : "hidden" })
        
        circle.exit().remove();

        text = text.data(force.nodes(), function (d) {return d.id;});
        text.enter().append("text")
            .attr("x", function(d){ return d.type == 'transition' ? 45 : 30})
            .attr("y", ".45em")
            .attr("size", 10);
            
        text.text(function(d) { return d.name; });
        text.exit().remove();
        
        force.start();
        
        return true;
    }
    
    // Event handling methods
    function dragEnd(d) {        
    }
    
    function dblclick(d) {
        d.lua_node.set("selected", false);
        d3.select(this).classed("selected", d.selected = false);
    }
    
    function click(d){
        d.lua_node.set("selected", true);
        d3.select(this).classed("selected", d.selected = true);
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
    
    // Some test methods. Nothing fancy
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
