'use strict';

//list of truckers
//useful for ALL 5 exercises
var truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL exercises
//The `price` is updated from exercice 1
//The `commission` is updated from exercice 3
//The `options` is useful from exercice 4
var deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury' : 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury' : 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury' : 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from exercise 5
const actors = [{
  'rentalId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'owner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'owner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'owner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

console.log(truckers);
console.log(deliveries);
console.log(actors);

//computation of the shipping price
for(var numDelivery=0; numDelivery<deliveries.length; numDelivery++)
{
  var pricePerKm = 0;
  var pricePerVolume = 0;
  for(var numTrucker = 0; numTrucker<truckers.length; numTrucker++)
  {
    if(deliveries[numDelivery].truckerId === truckers[numTrucker].id) {
      pricePerKm=truckers[numTrucker].pricePerKm;
      pricePerVolume=truckers[numTrucker].pricePerVolume;
    }
  }

  //computation of the decreasing according to the volume
  var decreasing = 1;
  if(deliveries[numDelivery].volume>=25)
  {
    decreasing = 0.5;
  }
  else if(deliveries[numDelivery].volume>=10)
  {
    decreasing = 0.7;
  }
  else if(deliveries[numDelivery].volume>=5)
  {
    decreasing = 0.9;
  }

  //computation of additionnal charges (deductible)
  var deductibleReduction = 0;
  if(deliveries[numDelivery].options.deductibleReduction === true)
  {
    deductibleReduction = deliveries[numDelivery].volume;
  }

  //price
  var shippingPrice = decreasing*(deliveries[numDelivery].distance*pricePerKm + deliveries[numDelivery].volume*pricePerVolume);
  deliveries[numDelivery].price = shippingPrice + deductibleReduction;

  //computation of the commission (the additionnal charge goes to convargo, not to the trucker)
  var commission = 0.3*(shippingPrice) + deductibleReduction;
  deliveries[numDelivery].commission.insurance = 0.5*(commission - deductibleReduction);
  deliveries[numDelivery].commission.treasury = 1 + Math.floor(deliveries[numDelivery].distance/500);
  deliveries[numDelivery].commission.convargo = commission-(deliveries[numDelivery].commission.treasury + deliveries[numDelivery].commission.insurance);

  //payment
  for(var numActor = 0; numActor < actors.length ; numActor++)
  {
    if (actors[numActor].rentalId === deliveries[numDelivery].id)
    {
      //shipper
      actors[numActor].payment[0].amount = shippingPrice + deductibleReduction;
      //trucker
      actors[numActor].payment[1].amount = deliveries[numDelivery].price - commission;
      //insurance
      actors[numActor].payment[2].amount = deliveries[numDelivery].commission.insurance;
      //treasury
      actors[numActor].payment[3].amount = deliveries[numDelivery].commission.treasury;
      //convargo
      actors[numActor].payment[4].amount = deliveries[numDelivery].commission.convargo;
    }
  }
}
console.log(deliveries);
