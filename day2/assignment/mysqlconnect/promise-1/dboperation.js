
var Promise = require("bluebird");
var connection      = require('./connection');

var conn = connection.con;

module.exports.promiseobj = Promise;
module.exports.fetchAllUsers = function(){
	return new Promise(function(resolve,reject){
    conn.query("select * from user",function(err,rows,fields){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.addUser = function(userdata){
	return new Promise(function(resolve,reject){
    conn.query('insert into user set ?',userdata,function(err,rows,fields){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.updateUser = function(userdata,id){
	return new Promise(function(resolve,reject){
	var q1 = 'update user set ';
	for(var key in userdata){
		q1 += ''+key+' = "'+userdata[key]+'",';
	}
	q1 = q1.replace(/,\s*$/, "");
	q1 += ' where id='+id+'';
	//console.log(q1);
	//return resolve(q1);
    conn.query(q1,function(err,rows){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};


module.exports.deleteUser = function(id){
	return new Promise(function(resolve,reject){
    conn.query('delete from user where id = ? ',[id],function(err,rows){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.deleteUserFromLoginT = function(id){
    return new Promise(function(resolve,reject){
    conn.query('delete from login where user_id = ? ',[id],function(err,rows){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
    
};

module.exports.checkValiduser = function(email,pass){
	return new Promise(function(resolve,reject){
    conn.query("select id from user where email = ? and password = ? ",[email,pass],function(err,rows,fields){

        if(err){             
            return reject(err);
        }else{ 
                  
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.updateToken = function(isloggedin,token,id){
	return new Promise(function(resolve,reject){
    conn.query('update login set isloggedin = ?, token = ? where user_id = ?',[isloggedin,token,id],function(err,rows){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};


module.exports.addLoggedinUser = function(luserdata){
	return new Promise(function(resolve,reject){
    conn.query('insert into login set ?',luserdata,function(err,rows,fields){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.checkloggedinUser = function(token){
	return new Promise(function(resolve,reject){
    conn.query("select user_id from login where token = ? ",[token],function(err,rows,fields){

        if(err){             
            return reject(err);
        }else{ 
                  
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.addFriend = function(frienddata){
	return new Promise(function(resolve,reject){
    conn.query('insert into friend set ?',frienddata,function(err,rows,fields){

        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.fetchAllFriend = function(id){
	return new Promise(function(resolve,reject){
    conn.query('select u.name from user as u left join friend as f on u.id = f.friend_id where f.user_id = ? ',[id],function(err,rows,fields){
    		
        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.fetchOneFriend = function(user_id,id){
	return new Promise(function(resolve,reject){
    conn.query('select u.name, u.mobno from user as u left join friend as f on u.id = f.friend_id where f.user_id = ? and f.friend_id = ? ',[user_id,id],function(err,rows,fields){
    		
        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.deleteFriend = function(user_id,id){
	return new Promise(function(resolve,reject){
    conn.query('delete from friend where user_id = ? and friend_id = ? ',[user_id,id],function(err,rows,fields){
    		
        if(err){                
            return reject(err);
        }else{              
            return resolve(rows);
        }

    }); // query
  }); 
	
};

module.exports.searchFriendByName = function(user_id,name){
	return new Promise(function(resolve,reject){
    conn.query('select name, mobno from user where id in(select friend_id from friend where user_id = ?) and name like "%'+name+'%"',[user_id],function(err,rows,fields){
    		
        if(err){ console.log(err);                
            return reject(err);
        }else{            
            return resolve(rows);
        }

    }); // query
  }); 
	
};