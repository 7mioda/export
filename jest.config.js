module.exports = {
  globalSetup: './test/config/setup.js',
  globalTeardown: './test/config/teardown.js',
  testEnvironment: './test/config/mongoEnvironment',
};

{$project: { _id: 0 , id:  "$_id"  , age: { $toDouble: "$first_name" }, supplier:  1 }},
{ $match:  {"$age": { $lt: 3 }} } ,
  {$sort: { age: -1 }},
  {$limit: 5 }
