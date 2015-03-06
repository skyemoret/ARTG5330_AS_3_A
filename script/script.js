var margin = {t:50,r:125,b:50,l:125};
var width = $('.plot').width() - margin.r - margin.l,
    height = $('.plot').height() - margin.t - margin.b;

var canvas = d3.select('.plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//Scale for the size of the circles
var scaleR = d3.scale.sqrt().domain([5,105]).range([5,120]);


d3.csv('data/olympic_medal_count.csv', parse, dataLoaded);

function dataLoaded(err,rows){

    console.log(rows);
    console.log("Data loaded");

    var year = 1900;    //default 'refresh' screen
    rows.sort(function(a,b){
        //Note: this is called a "comparator" function
        //which makes sure that the array is sorted from highest to lowest
        return b[year] - a[year];       //*b and a are any two countries within one year
    });
    //Note: this returns positions 0,1,2,3,4 of the "rows" array
    var top5 = rows.slice(0,5); //slice = grab elements of the array from index 0 to 5 (not including 5)
    draw(top5, year);

    //TODO: fill out this function
    $('.btn-group .year').on('click',function(e){
        e.preventDefault();

        var year = $(this).data('year');    //grabbing "-year" from "data-year" in html
        console.log(year);

        rows.sort(function(a,b){
            //Note: this is called a "comparator" function
            //which makes sure that the array is sorted from highest to lowest
            return b[year] - a[year];       //*b and a are any two countries within one year?
        });

        //Note: this returns positions 0,1,2,3,4 of the "rows" array
        var top5 = rows.slice(0,5); //slice = grab elements of the array from index 0 to 5 (not including 5)
        draw(top5, year);
    });
}

function draw(rows, year) {

    console.log("drawing...")
    var topTeams = canvas.selectAll('.team')
        .data(rows, function (d) {
            return d.country;
        });  //updates country

    //Enter
    var teamsEnter = topTeams.enter()   //creating empty elements
        .append('g')
        .attr('class', 'team')
        .attr('transform', function (d, i) {
            //i ranges from 0 to 4
            return 'translate(' + i * (width / 4) + ',' + 0 + ')';
        })
        .style('opacity', 0);
    teamsEnter
        .append('circle')
        .attr('r', 0);

    teamsEnter
        .append('text')     //write country name
        .attr('class', 'team-name')     //once appended, team-name doesn't change
        .text(function (d) {
            return d.country;
        })
        .attr('y', function (d) {
            return scaleR(d[year] + 20);
        })
        .attr('text-anchor', 'middle');

    teamsEnter  //write medal count
        .append('text')
        .attr('class', 'medal-count')
        .text(function (d) {
            return d[year];
        })
        .attr('text-anchor', 'middle');

    //Exit
    topTeams.exit()
        .transition()
        .duration(500)
        .attr('transform', function (d, i) {
            //i ranges from 0 to 4
            return 'translate(' + i * (width / 4) + ',' + height + ')';
        })
        .attr('r', 0)
        .style('opacity', 0)
        .remove();

    //Update set = update + Enter (does Enter already)
    //topTeams = everything left on the screen after the exit
    var topTeamsTransition = topTeams
        .transition()
        .duration(500);

    topTeamsTransition
        .attr('transform', function (d, i) {    //moves circle on x+y axis
            //i ranges from 0 to 4
            return 'translate(' + i * (width / 4) + ',' + height / 2 + ')';
        })
        .style('opacity', 1);

    topTeamsTransition
        .select('circle')
        .attr('r', function (d) {   //updates size of circle
            return d[year];
        });
    topTeamsTransition
        .select('.team-name')
        .attr('y', function (d) {
            console.log(d, scaleR(d[year] + 20));
            return scaleR(d[year] + 20);       //updates location of team-name
        });
    topTeamsTransition
        .select('.medal-count')
        .text(function (d) {
            return d[year];     //updates medal-count avlue
        });
}

function parse(row){
    //@param row is each unparsed row from the dataset
    return {
        country: row['Country'],
        1900: +row['1900'],
        1960: +row['1960'],
        2012: +row['2012']
    };
}