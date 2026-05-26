var hit = context.getVariable('lookupcache.LC-WeatherAggregated.cachehit');
context.setVariable('cache.status', hit ? 'HIT' : 'MISS');
