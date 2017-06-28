
var bodyParser=require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

if (typeof localStorage === "undefined" || localStorage === null) 
        {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
        }

var express=require('express');
var app=express();
var path=require('path');
app.set('view engine','ejs');
app.use('/public',express.static('public'));

var Inq_url="/Inquiries";
var Inq_Res="/Inq_Results";
var Calc_url="/Calculator";
var Calc_Res="/Calc_Results";
var Total="/Total";
var Total_Res="/Total_Res";
var Complex="/Complex";
var Complex_Res="/Complex_Res";

app.get('/',function(req,res)
{
    res.render('Start');
});



app.get(Complex,function(req,res)
{
    res.render('Complex',{qs: req.query});
});
app.post(Complex,urlencodedParser,function(req,res)
{
    
    var data_from_form=JSON.parse(JSON.stringify(req.body));
    var sql_to_run=data_from_form.sql;

    
    var age=data_from_form.age;
    var month=data_from_form.month;
    console.log("Age:"+age+" Month"+month);

    
    
    var sql_to_run="SELECT * FROM (SELECT Death_Causes.CauseSmall FROM Death_Causes, Time, Personal WHERE ";
    sql_to_run = sql_to_run + "TIME.ID = Death_Causes.ID AND PERSONAL.ID = Death_Causes.ID AND ";
    sql_to_run = sql_to_run + "PERSONAL.AGE <" + age + " AND TIME.MONTHOFDEATH<>" + month;
    sql_to_run= sql_to_run + " GROUP BY Death_Causes.CAUSESMALL ORDER BY Count(20) DESC) smalldeath ";
    //sql_to_run=sql_to_run+" WHERE Death_Causes.ID=Time.ID AND Personal.ID=Time.ID AND Personal.Age <"+age+" AND Personal.AgeType='Years' AND TIME.MONTHOFDEATH="+month;
    sql_to_run=sql_to_run+" WHERE ROWNUM <=20 ORDER BY ROWNUM";
    console.log(sql_to_run);
    run_db(sql_to_run);
    


    setTimeout(function()
    {
    res.render('Complex_Res', {data: req.body});
    }, 2000);

});








app.get(Total,function(req,res)
{
    res.render('Total',{qs: req.query});
});
app.post(Total,urlencodedParser,function(req,res)
{
    
    var data_from_form=JSON.parse(JSON.stringify(req.body));
    var sql_to_run=data_from_form.sql;

    
    var sex=data_from_form.sex;
    var race=data_from_form.race;
    var education=data_from_form.education;
    var marital_status=data_from_form.marital_status;
    var cause0=data_from_form.cause0;
    var check_value=data_from_form.GroupBy;

    var sql_to_run="SELECT Count(*)"



    /*
    if(sex != null && !sex.isEmpty()) 
    sql_to_run=sql_to_run+"Sex, ";
    if(race != null && !race.isEmpty())
    sql_to_run=sql_to_run+"Race, ";
    if(education != null && !education.isEmpty())
    sql_to_run=sql_to_run+"Education, ";
    if(marital_status != null && !marital_status.isEmpty())
    sql_to_run=sql_to_run+"Maritalstatus, ";
    if(cause0 != null && !cause.isEmpty())
    sql_to_run=sql_to_run+"Cause, ";
    */
    var sql_to_run=sql_to_run+" FROM Personal, Education, Death_Causes, Time "
    var sql_to_run=sql_to_run+"WHERE ";
    var sql_to_run=sql_to_run.replace(", WHERE", " WHERE");

    var sql_to_run=sql_to_run+"Death_Causes.ID=Education.ID AND Education.ID=Personal.ID AND Personal.ID=Time.ID AND ";

    if(sex && check_value!="Sex") 
    sql_to_run=sql_to_run+"Sex='"+sex+"' AND ";
    if(race && check_value!="Race")
    sql_to_run=sql_to_run+"Race='"+race+"' AND ";
    if(education && check_value!="Education2")
    sql_to_run=sql_to_run+"Education2='"+education+"' AND ";
    if(marital_status && check_value!="Maritalstatus")
    sql_to_run=sql_to_run+"Maritalstatus='"+marital_status+"' AND ";
    if(cause0 && check_value!="MannerofDeath")
    sql_to_run=sql_to_run+"MannerofDeath='"+cause0+"' AND";

    sql_to_run = sql_to_run.substring(0, sql_to_run.length - 5);
    //TODO:Make an option not to group by




    //

    //formulate sql query




    //

    //run database. results will be stored on the other side
    console.log(sql_to_run);
    run_db(sql_to_run);



    setTimeout(function()
    {
    res.render('Total_Res', {data: req.body});
    }, 2000);

});

app.get(Inq_url,function(req,res)
{
    res.render('Inquiries',{qs: req.query});
});
app.post(Inq_url,urlencodedParser,function(req,res)
{
    
    var data_from_form=JSON.parse(JSON.stringify(req.body));
    var sql_to_run=data_from_form.sql;

    
    var sex=data_from_form.sex;
    var race=data_from_form.race;
    var education=data_from_form.education;
    var marital_status=data_from_form.marital_status;
    var cause0=data_from_form.cause0;
    var check_value=data_from_form.GroupBy;

    var sql_to_run="SELECT AVG(Age), "+check_value+" ";



    /*
    if(sex != null && !sex.isEmpty()) 
    sql_to_run=sql_to_run+"Sex, ";
    if(race != null && !race.isEmpty())
    sql_to_run=sql_to_run+"Race, ";
    if(education != null && !education.isEmpty())
    sql_to_run=sql_to_run+"Education, ";
    if(marital_status != null && !marital_status.isEmpty())
    sql_to_run=sql_to_run+"Maritalstatus, ";
    if(cause0 != null && !cause.isEmpty())
    sql_to_run=sql_to_run+"Cause, ";
    */
    var sql_to_run=sql_to_run+" FROM Personal, Education, Death_Causes, Time "
    var sql_to_run=sql_to_run+"WHERE ";
    var sql_to_run=sql_to_run.replace(", WHERE", " WHERE");

    var sql_to_run=sql_to_run+"Death_Causes.ID=Education.ID AND Education.ID=Personal.ID AND Personal.ID=Time.ID AND "+check_value+"<>'Unknown' AND ";

    if(sex && check_value!="Sex") 
    sql_to_run=sql_to_run+"Sex='"+sex+"' AND ";
    if(race && check_value!="Race")
    sql_to_run=sql_to_run+"Race='"+race+"' AND ";
    if(education && check_value!="Education2")
    sql_to_run=sql_to_run+"Education2='"+education+"' AND ";
    if(marital_status && check_value!="Maritalstatus")
    sql_to_run=sql_to_run+"Maritalstatus='"+marital_status+"' AND ";
    if(cause0 && check_value!="MannerofDeath")
    sql_to_run=sql_to_run+"MannerofDeath='"+cause0+"' AND";

    sql_to_run = sql_to_run.substring(0, sql_to_run.length - 5);
    //TODO:Make an option not to group by
    var sql_to_run=sql_to_run+" GROUP BY "+check_value;



    //

    //formulate sql query




    //

    //run database. results will be stored on the other side
    console.log(sql_to_run);
    run_db(sql_to_run);



    setTimeout(function()
    {
    res.render('Inq_Results', {data: req.body});
    }, 2000);

});


app.get(Calc_url,function(req,res)
{
    res.render('Calculator',{qs: req.query});
});
app.post(Calc_url,urlencodedParser,function(req,res)
{
    
    var data_from_form=JSON.parse(JSON.stringify(req.body));
    var sql_to_run=data_from_form.sql;

    
    var sex=data_from_form.sex;
    var race=data_from_form.race;
    var education=data_from_form.education;
    var marital_status=data_from_form.marital_status;
    var cause0=data_from_form.cause_0;
    var check_value=data_from_form.GroupBy;


    var sql_to_run="SELECT Death_Causes.ID, Death_Causes.PLACEOFDEATH, Death_Causes.INJURYATWORK, Death_Causes.MannerofDeath, Death_Causes.METHODOFDISPOSITION, Death_Causes.AUTOPSY, Death_Causes.ACTIVITY, Death_Causes.CAUSESMALL," +
     " Education.Education2," + " Personal.SEX, Personal.AGETYPE, PERSONAL.AGE, PERSONAL.Maritalstatus, PERSONAL.Race, " +
     "TIME.MONTHOFDEATH, TIME.DAYOFWEEKOFDEATH";

    /*
    if(sex != null && !sex.isEmpty()) 
    sql_to_run=sql_to_run+"Sex, ";
    if(race != null && !race.isEmpty())
    sql_to_run=sql_to_run+"Race, ";
    if(education != null && !education.isEmpty())
    sql_to_run=sql_to_run+"Education, ";
    if(marital_status != null && !marital_status.isEmpty())
    sql_to_run=sql_to_run+"Maritalstatus, ";
    if(cause0 != null && !cause.isEmpty())
    sql_to_run=sql_to_run+"Cause, ";
    */
    var sql_to_run=sql_to_run+" FROM Personal "
        sql_to_run=sql_to_run+" INNER JOIN Education on Education.ID=Personal.ID";
    sql_to_run=sql_to_run+" INNER JOIN Death_Causes on Death_Causes.ID=Education.ID";
    sql_to_run=sql_to_run+" INNER JOIN Time on Time.ID=Death_Causes.ID";
    var selection_has_been_made=false;

    //var sql_to_run=sql_to_run+"Death_Causes.ID=Education.ID AND Education.ID=Personal.ID AND Personal.ID=Time.ID AND ";
    if(sex || race || education || marital_status || cause0)
    {
    sql_to_run=sql_to_run+" Where ";
    selection_has_been_made=true;
    }
    if(sex) 
    sql_to_run=sql_to_run+"Sex='"+sex+"' AND ";
    if(race)
    sql_to_run=sql_to_run+"Race='"+race+"' AND ";
    if(education)
    sql_to_run=sql_to_run+"Education2='"+education+"' AND ";
    if(marital_status)
    sql_to_run=sql_to_run+"Maritalstatus='"+marital_status+"' AND ";
    if(cause0)
    sql_to_run=sql_to_run+"MannerofDeath='"+cause0+"' AND ";
    if(selection_has_been_made)
    sql_to_run = sql_to_run.substring(0, sql_to_run.length - 5);
    //TODO:Make an option not to group by




    //

    //formulate sql query




    //

    //run database. results will be stored on the other side
   // sql_to_run="Select Count(*) FROM Personal";
    console.log(sql_to_run);
    run_db(sql_to_run);



    setTimeout(function()
    {
    res.render('Calc_Results', {data: req.body});
    }, 2000);

});

app.get(Calc_Res,function(req,res)
{
    res.render('Calc_Results');
});
app.listen(3000);


var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

function run_db(sql_statement)
{
  
// Get a non-pooled connection
oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection)
  {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      // The statement to execute
      
      sql_statement,



      // The "bind value" 180 for the "bind variable" :id
      //[180],

      // Optional execute options argument, such as the query result format
      // or whether to get extra metadata
      // { outFormat: oracledb.OBJECT, extendedMetaData: true },

      // The callback function handles the SQL execution results

      function(err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log(result.metaData);
        console.log(result.rows);
        var ex=JSON.parse(JSON.stringify(result.rows));
        if (typeof localStorage === "undefined" || localStorage === null) 
        {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
        }
        localStorage.setItem("sql_statement",ex);
        console.log("Local storage now setting "+ex);

       //sendto


        doRelease(connection);
      });
  });

// Note: connections should always be released when not needed
function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}



}
