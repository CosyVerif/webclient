/*
 *  COSIVERIF JAVASCRIPT WEB CLIENT
 */
 
    // Node size
    var rect_size = 30
    var radius = rect_size / 2;
    
    /* 
     * This object contains the d attribute of the path that later will come part of the force layout.
     * The shapes are defined so that the (0,0) is the center of each one. 
     */
    var shapes = {
        rect : "M " + -rect_size + " " + (-rect_size / 2) + " h " + 2 * rect_size + " v " + rect_size + " h "+ (-2 *    rect_size) + " z",
        vertical_rect : "M " + (-rect_size / 2) + " " + -rect_size + " h " + rect_size + " v " + 2 * rect_size + " h "      + (-rect_size) + " z",
        circle: "M " + (-radius) + " " + (-radius) + "a "+ radius + " " + radius +" 0 1 0 0.00001 0 "
        };

    var nodes = [];
    var links = [];
    
    /*
     * Definition of the force graph and shapes.
     */
    var margin = {top: -5, right: -5, bottom: -5, left: -5},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        markerWidth = 8,
        markerHeight = 8,
        cRadius = 20, // play with the cRadius value
        refX = cRadius + markerWidth,
        refY = -Math.sqrt(cRadius),
        drSub = cRadius + refY;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);
        
    var force = d3.layout.force()
        .links(links)
        .nodes(nodes)
        .size([width, height])
        .linkDistance(100)
        .charge(-1000)
        .on("tick", tick);

    function zoomed() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    
    var drag = force.drag().on("dragstart", dragstart);
    
    // We start to append elements to the original html.
    var svg = d3.select("#model_container").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("stroke", "black");
        //~ .call(zoom);

    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", refX)
        //~ .attr("refY", refY)
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
        

    var path = svg.append("svg:g").selectAll("path");
    
    var node = svg.append("svg:g").selectAll(".node");
    
    function updateForceLayout() {
        
        force = d3.layout.force()
            .links(links)
            .nodes(nodes)
            .size([width, height])
            .linkDistance(200)
            .charge(-300)
            .on("tick", tick)
            
        path = path.data(force.links());
        path.enter().insert("svg:path", ".node");
        
        path.attr("class", function (d) {return "link " + d.type;})
            .attr("marker-end", function (d) {return "url(#" + d.type + ")";});
        
        path.exit().remove();
        
        node = node.data(force.nodes(), function (d) {return d.id;});
        node.enter().append("path");
        node.attr("class", "node")
            .attr("d", function(d){ return d.shape;})
            .on("dblclick", dblclick)
            .call(drag);
            
        node.exit().remove();
        
        force.start();
        
        return true;
    }
    
    //~ updateForceLayout();
    
    function updateModel(input_nodes, input_links){
        indexs = {};
        
        //~ We empty the previous nodes and links of the force layout
        nodes = [];
        links = [];
        for(i = 0; i < input_nodes.length; i++) {
            n = input_nodes[i];
            indexs[n.name] = i;
            node_shape = n.type == 'transition' ? shapes.rect : shapes.circle;
            nodes.push({id: n.name, shape: node_shape});
        }
        
        var source, target;
        
        for(j = 0; j < input_links.length; j++) {
            l = input_links[j];
            
            source = nodes[indexs[l.source]];
            target = nodes[indexs[l.target]];
            
            links.push({source: source, target: target, type: "licensing"});
        }
        updateForceLayout();    
    }

/******************************************************************************************************/
    //~ var text = svg.append("svg:g").selectAll("g")
        //~ .data(force.nodes())
        //~ .enter().append("svg:g");

    // A copy of the text with a thick white stroke for legibility.
    //~ text.append("svg:text")
        //~ .attr("x", 0)
        //~ .attr("y", ".51em")
        //~ .attr("class", "shadow")
        //~ .text(function (d) {
        //~ return d.name;
    //~ });

    //~ text.append("svg:text")
        //~ .attr("x", 0)
        //~ .attr("y", ".51em")
        //~ .text(function (d) {
        //~ return d.name;
    //~ });

    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
        force.start();
    }

    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = (d.target.y - d.source.y),
                dr = Math.sqrt(dx * dx + dy * dy);
            /* 
             * TODO: Change this harcoded array into a a function or other 
             * functionality
             */
            
            var link_shapes = {
                "licensing": "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y,
                "resolved": "M" + d.source.x + "," + d.source.y + "H" + d.target.x + " V " + d.target.y, 
                "elliptic": "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y };
        
            return link_shapes[d.type];
        });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        //~ text.attr("transform", function (d) {
            //~ return "translate(" + d.x + "," + d.y + ")";
        //~ });
    }
