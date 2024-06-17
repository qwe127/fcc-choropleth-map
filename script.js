const urlEducationData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const urlCountyData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const width = 950
const height = 650
const padding = 70

const mainFunction = async () => {
    const responseCounty = await fetch(urlCountyData)
    const responseEduction = await fetch(urlEducationData)

    const dataCounty = await responseCounty.json()
    const geoJson = topojson.feature(dataCounty, dataCounty.objects.counties).features

    const dataEducation = await responseEduction.json()
    const colorArray = ["#3b94d9","#3280bc","#296da1","#215a86","#19486c","#113653","#09263b"]

    const legendCanvas = d3.select('.svgCanvas').append('svg').attr('id', 'legend').attr('width', width / 4).attr('height', height / 4)

    console.log(dataEducation)
    console.log(geoJson)

    d3.select('body').append('h1').text('FCC Choropleth Map').attr('id', 'title')
    d3.select('body').append('p').text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)").attr('id', 'description')
    d3.select('body').append('svg').attr('width', width).attr('height', height).style('background-color', 'rgb(30, 29, 36)').attr('id', 'svgCanvas')


    d3.select('#svgCanvas').selectAll('path').data(geoJson).enter().append('path').attr('d', d3.geoPath()).attr('class', 'county')
    .attr('fill', (d)=>{
        let county = dataEducation.find((i)=> {return i.fips === d.id})
        if (county.bachelorsOrHigher <= 10){
            return colorArray[0]
        }
        if (county.bachelorsOrHigher <= 20){
            return colorArray[1]
        }
        if (county.bachelorsOrHigher <= 30){
            return colorArray[2]
        }
        if (county.bachelorsOrHigher <= 40){
            return colorArray[3]
        }
        if (county.bachelorsOrHigher <= 50){
            return colorArray[4]
        } 
        if (county.bachelorsOrHigher <= 60){
            return colorArray[5]
        } 
        else {return colorArray[6]}
    })   
    .attr('data-fips', (d)=>d.id)
    .attr('data-education', (d)=>{
        let county = dataEducation.find((i) => {return i.fips === d.id})
        return county.bachelorsOrHigher
    })
    d3.select('#svgCanvas').append('svg').attr('height', height/4).attr('width', width / 4).attr('id', 'legend').attr('x', 650).style('background-color', 'black')
    legendCanvas
    .data(colorArray)
    .enter()
    .select('#legend')
    .append('rect')
    .attr('x', (_, i)=>30 * i)
    .attr('y', 20)
    .attr('width', 30)
    .attr('height', 15)
    .attr('fill', (d, i) => colorArray[i])
    .attr('id', 'legend-rect')
    
    d3.select('#legend').append('text')  
    .text('10%')
    .attr('x', 0)
    .attr('y', 50)
    .attr('id', 'legend-text')
    .attr('font-size', 12)
    .attr('fill', 'white')
 
    d3.select('#legend')
    .append('text')  
    .text('60%')
    .attr('x', 190)
    .attr('y', 50)
    .attr('id', 'legend-text')
    .attr('font-size', 12)
    .attr('fill', 'white')

    const tooltip = d3.select('#tooltip')
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("border-width", "1px")

    d3.selectAll('.county').data(geoJson)
    .on("mouseover", (event, d) => {
        let county = dataEducation.find((i) => {return i.fips === d.id})

        tooltip.attr('data-education', (_)=> county.bachelorsOrHigher)
        tooltip.style("visibility", "visible")
        tooltip.style("opacity", "1")
        tooltip.html(`<p>${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%</p>`)        
        .style('outline', '1.5px solid rgba(0, 0, 0, 0.616)')
    })
    .on("mousemove", (event, d) => {
        const x = event.x
        const y = event.y
            return tooltip.style('top', y + 10 + 'px').style('left', x + 10 +'px')})
    .on("mouseout", () => {return tooltip.style("opacity", "0").style('visibility', 'hidden')});
}

document.addEventListener('DOMContentLoaded', mainFunction)