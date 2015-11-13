window.addEventListener("load", run);

var GLOBAL = {
    data: [],
		color: ["cyan","magenta","yellow","white","blue","red","green"],
        filterSex: [],
        filterRace: [],
        filterCause: [],
        fData: {}
}

function run() {
    d3.selectAll("svg")
	    .append("text")
		.attr("id","loading")
		.attr("x",100)
		.attr("y",150)
		.attr("dy","0.35em")
		.text("loading data...");

    getData("","",function(data) {
    	GLOBAL.data=data;
    	timelineView(data);
      //createView(data)
      updateRaceView();
       });
}

function filter(){
	if(filterSex.length===0 & filterRace.length===0 & filterCause.length===0){
		GLOBAL.fData=GLOBAL.data;
	}else{
		fData=[];
		GLOBAL.fData.data.forEach(function (r) {
    });
	}
}

function getTotal (data,cause,year) {
    if (cause in data) {
	if (year in data[cause]) {
	    if (data[cause][year].length > 0) {
		return data[cause][year][0].total;
	    }
	}
    }
    return 0;
}

function timelineView (data){
	var svg = d3.select("#timeline");

	// note: the width attribute holds strings
    var x2003 = +svg.attr("width")*1/9;
    var x2008 = +svg.attr("width")*1/2;
    var x2013 = +svg.attr("width")*8/9;

    var causes = GLOBAL.data["causes"];

    console.log(causes);
    max2013 = d3.max(causes.map(function(d) { return getTotal(data,d,"2013"); }));
    max2008 = d3.max(causes.map(function(d) { return getTotal(data,d,"2008"); }));
    max2003 = d3.max(causes.map(function(d) { return getTotal(data,d,"2003"); }));

    var y2003 = function(d) { return y(getTotal(data,d,"2003")); };
    var y2008 = function(d) { return y(getTotal(data,d,"2008")); };
    var y2013 = function(d) { return y(getTotal(data,d,"2013")); };

    var y = d3.scale.linear()
		.domain([0,Math.max(max2008,max2013,max2003)])
		.range([+svg.attr("height")-10,10]);

    var g = svg.selectAll("g")
		.data(causes)
		.enter()
		.append("g")

	g.append("circle")
		.attr("cx",x2003)
		.attr("cy",y2003)
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("circle")
		.attr("cx",x2008)
		.attr("cy",y2008)
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("circle")
		.attr("cx",x2013)
		.attr("cy",y2013)
		.attr("r","5")
		.style("fill","red")
		.style("stroke","none");

    g.append("line")
    	.attr("x1",x2003)
		.attr("y1",y2003)
		.attr("x2",x2008)
		.attr("y2",y2008)
		.style("stroke","red")
		.style("stroke-width","6px");

	g.append("line")
    	.attr("x1",x2008)
		.attr("y1",y2008)
		.attr("x2",x2013)
		.attr("y2",y2013)
		.style("stroke","red")
		.style("stroke-width","6px");

    g.on("mouseover",function (d,i) {
	d3.select(this).selectAll("line").style("stroke","blue");
	d3.select(this).selectAll("circle").style("stroke","blue");
	d3.select(this)
	    .append("text")
	    .attr("class","label")
	    .attr("x",+svg.attr("width")*1/9+20)
	    .attr("y",function(d) { return y(getTotal(data,d,"2003")); })
	    .attr("dy","0.35em")
	    .style("stroke","black")
	    .style("text-anchor","start")
	    .text(function(d) { return CAUSE[d]; }) })

	.on("mouseout",function() {
	d3.select(this).select("line").style("stroke","red");
	    d3.selectAll(".label").remove();
	});
}

function getData (sex,race,f) {

    d3.json("data")
	.header("Content-Type", "application/x-www-form-urlencoded")
	.get("sex="+encodeURIComponent(sex)+"%race="+encodeURIComponent(race),
	     function(error,data) {
		 if (error) {
		     d3.select("#loading").remove();
		     console.log(error);
		 } else {
		     d3.select("#loading").remove();
		     console.log(" data =", data);
		     f(data);
		 }
	     });
}


function updateRaceView()
{
  // Calculate race totals
  var totals = []
  for (race in GLOBAL.races)
  {
    console.log(race);
    totals[race] = 50; // the actual total
  }
}

var RACE = {
	"0": "Other",
	"1": "White",
	"2": "Black",
	"3": "American Indian",
	"4": "Asian/Pacific Islander"

}

var CAUSE = {
    "1":"Tuberculosis (A16-A19)",
    "2":"Syphilis (A50-A53)",
    "3":"Human immunodeficiency virus (HIV) disease (B20-B24)",
    "4":"Malignant neoplasms (C00-C97)",
    "5":"Malignant neoplasm of stomach (C16)",
    "6":"Malignant neoplasms of colon, rectum and anus (C18-C21)",
    "7":"Malignant neoplasm of pancreas (C25)",
    "8":"Malignant neoplasms of trachea, bronchus and lung (C33-C34)",
    "9":"Malignant neoplasm of breast (C50)",
    "10":"Malignant neoplasms of cervix uteri, corpus uteri and ovary (C53-C56)",
    "11":"Malignant neoplasm of prostate (C61)",
    "12":"Malignant neoplasms of urinary tract (C64-C68)",
    "13":"Non-Hodgkin's lymphoma (C82-C85)",
    "14":"Leukemia (C91-C95)",
    "15":"Other malignant neoplasms (C00-C15,C17,C22-C24,C26-C32,C37-C49,C51-C52, C57-C60,C62-C63,C69-C81,C88,C90,C96-C97)",
    "16":"Diabetes mellitus (E10-E14)",
    "17":"Alzheimer's disease (G30)",
    "18":"Major cardiovascular diseases (I00-I78)",
    "19":"Diseases of heart (I00-I09,I11,I13,I20-I51)",
    "20":"Hypertensive heart disease with or without renal disease (I11,I13)",
    "21":"Ischemic heart diseases (I20-I25)",
    "22":"Other diseases of heart (I00-I09,I26-I51)",
    "23":"Essential (primary) hypertension and hypertensive renal disease (I10,I12,I15)",
    "24":"Cerebrovascular diseases (I60-I69)",
    "25":"Atherosclerosis (I70)",
    "26":"Other diseases of circulatory system (I71-I78)",
    "27":"Influenza and pneumonia (J09-J18)",
    "28":"Chronic lower respiratory diseases (J40-J47)",
    "29":"Peptic ulcer (K25-K28)",
    "30":"Chronic liver disease and cirrhosis (K70,K73-K74)",
    "31":"Nephritis, nephrotic syndrome, and nephrosis (N00-N07,N17-N19,N25-N27)",
    "32":"Pregnancy, childbirth and the puerperium (O00-O99)",
    "33":"Certain conditions originating in the perinatal period (P00-P96)",
    "34":"Congenital malformations, deformations and chromosomal abnormalities (Q00-Q99)",
    "35":"Sudden infant death syndrome (R95)",
    "36":"Symptoms, signs and abnormal clinical and laboratory findings, not  elsewhere classified (excluding Sudden infant death syndrome) (R00-R94,R96-R99)",
    "37":"All other diseases (Residual) (A00-A09,A20-A49,A54-B19,B25-B99,D00-E07, E15-G25,G31-H93,I80-J06,J20-J39,J60-K22,K29-K66,K71-K72, K75-M99,N10-N15,N20-N23,N28-N98,U04)",
    "38":"Motor vehicle accidents (V02-V04,V09.0,V12-V14,V19.0-V19.2,V19.4-V19.6, V20-V79,V80.3-V80.5,V81.0-V81.1,V82.0-V82.1,V83-V86,V87.0-V87.8, V88.0-V88.8,V89.0,V89.2)",
    "39":"All other and unspecified accidents and adverse effects (V01,V05-V06,V09.1,V09.3-V09.9,V10-V11,V15-V18,V19.3,V19.8-V19.9, V80.0-V80.2,V80.6-V80.9,V81.2-V81.9,V82.2-V82.9,V87.9,V88.9,V89.1, V89.3,V89.9,V90-X59,Y40-Y86,Y88)",
    "40":"Intentional self-harm (suicide) (*U03,X60-X84,Y87.0)",
    "41":"Assault (homicide) (*U01-*U02,X85-Y09,Y87.1)",
    "42":"All other external causes (Y10-Y36,Y87.2,Y89)"
}
