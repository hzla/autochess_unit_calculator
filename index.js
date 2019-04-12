tiers = {"common" : 13, "uncommon" : 14, "rare" : 12, "mythic" : 11, "legendary" : 7}
unit_pools = {"common" : 45, "uncommon" : 30, "rare" : 25, "mythic" : 15, "legendary" : 10}
tier_chances =  {
    1 : {"common" : 100, "uncommon" : 0, "rare" : 0, "mythic" : 0, "legendary" : 0},
    2 : {"common" : 70, "uncommon" : 30, "rare" : 0, "mythic" : 0, "legendary" : 0},
    3 : {"common" : 60, "uncommon" : 35, "rare" : 5, "mythic" : 0, "legendary" : 0},
    4 : {"common" : 50, "uncommon" : 35, "rare" : 15, "mythic" : 0, "legendary" : 0},
    5 : {"common" : 40, "uncommon" : 35, "rare" : 23, "mythic" : 2, "legendary" : 0},
    6 : {"common" : 33, "uncommon" : 30, "rare" : 30, "mythic" : 7, "legendary" : 0},
    7 : {"common" : 30, "uncommon" : 30, "rare" : 30, "mythic" : 10, "legendary" : 0},
    8 : {"common" : 24, "uncommon" : 30, "rare" : 30, "mythic" : 15, "legendary" : 1},
    9 : {"common" : 22, "uncommon" : 30, "rare" : 25, "mythic" : 20, "legendary" : 3},
    10 : {"common" : 19, "uncommon" : 25, "rare" : 25, "mythic" : 25, "legendary" : 6},
}

tier_names = {1 : "common", 2 : "uncommon", 3 : "rare", 4 : "mythic", 5: "legendary"}

function get_chances(unit_costs, courier_lvl, units_taken=[0]) {
	$('.chance-row, .spend-all').remove()
  // reset the table and result messages

  units = $('.unit-cost').length


  for (reroll_count=0; reroll_count < 51; reroll_count++ ) { //go through 50 rerolls  

    var chance = 0 // cumulative chance to hit any unit as you reroll
    var base_chance = 0 // the chance on one reroll
    
    for (unit_index=0; unit_index < units; unit_index++) { // loop through each unit being searched for
      if (unit_costs[unit_index] == "") {
        continue
      } // skip this unit if they left the field blank
      
      tier_name = tier_names[unit_costs[unit_index]] // get the rarity name

      unit_pool = unit_pools[tier_name] // get the number of units
      taken = units_taken[unit_index] // get the number of units taken out of pool
      
      chance += ((1 / tiers[tier_name]) * (tier_chances[courier_lvl][tier_name] / 100) * 5) * (unit_pool - taken) / unit_pool // add the chance of hitting this unit in the current 5 unit roll

    } 
    
    chance = 1 - Math.pow((1 - chance), reroll_count + 1)
    chance = chance * 100 
  	appendRow(reroll_count, chance)
    
    if (reroll_count == 0) {
      base_chance = chance
     
     $('#result').show()
        $('#reroll-number').show().text( Math.floor((1 / (chance / 100) * 2)).toString() + " gold")
       if ($('.gold-to-spend').val() != "") {
          rerolls = parseInt($('.gold-to-spend').val()) / 2
          chances_of_hitting = (1 - Math.pow((1 - (base_chance / 100)), rerolls + 1)) * 100


        $('#result').append( "<p class='spend-all'>If you spend all your gold, you have a " + chances_of_hitting.toString().slice(0,5) + "% chance of finding a unit.</p>"   ) 

       }
    }
  }
}

function appendRow(rerolls, chance) {
  $('#chances').append("<tr class='chance-row'></tr>" )
  $('#chances tr').last().append("<td>" + rerolls.toString() + "</td>" )
  $('#chances tr').last().append("<td>" + chance.toString().slice(0,5) + "%</td>" )
}

function calculate() {
  unit_costs = []
  $('.unit-cost').each(function() {
    unit_costs.push($(this).val())
  })

  units_taken = []
  $('.units-taken').each(function() {
    units_taken.push($(this).val())
  })

  courier_lvl = $('.courier-level').val()

  get_chances(unit_costs, courier_lvl, units_taken)
}

function addUnit() {
  unit_index = ($('.unit-cost').length + 1).toString()
  $('.unit-cost').last().clone().appendTo('.costs')
  
  $('#add-unit').appendTo('.costs')
  $('#remove-unit').show().appendTo('.costs')
  
  $('.unit-cost').last().val("").attr('name', 'unitCost-' + unit_index )

  $('.units-taken').last().clone().appendTo('.taken')
  $('.units-taken').last().val("0").attr('name', 'unitsTaken-' + unit_index )
}

function removeUnit() {
  $('.unit-cost').last().remove()
  $('.units-taken').last().remove()
  if ($('.unit-cost').length == 1) {
    $('#remove-unit').hide()
  } 
}

$( document ).ready(function() {
      $('#calculate').on('click', calculate)
      $('#add-unit').on('click', addUnit)
      $('#remove-unit').on('click', removeUnit)
});


