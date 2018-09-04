var g_curwalletname = '';
var g_curtable = '';
var g_curaction = '';
var g_eos = '';
var g_abidata = '';
function Main(){
	$("#tableid").hide();
	$("#actionid").hide();
	var $httpendpointid = $("#httpendpointid");
	$httpendpointid.val("https://mainnet.eoscannon.io");

	EosjsInit();

	const network = {
    blockchain:'eos',
    protocol:'https',
    host:'nodes.get-scatter.com',
    port:443,
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	}

	scatter.connect("ContractCommonTool").then(function(connected){
    // User does not have Scatter Desktop, Mobile or Classic installed.
    if(!connected) return false;
    window.scatter = null;
    console.log("scatter connect ok");

    const requiredFields = { accounts:[network] };
    scatter.getIdentity(requiredFields).then(() => {

        // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
        // the user for their account name beforehand. They could still give you a different account.
        const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');

        // You can pass in any additional options you want into the eosjs reference.
        const eosOptions = { expireInSeconds:60 };

        // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        const eos = scatter.eos(network, Eos, eosOptions);

        // ----------------------------
        // Now that we have an identity,
        // an EOSIO account, and a reference
        // to an eosjs object we can send a transaction.
        // ----------------------------


        // Never assume the account's permission/authority. Always take it from the returned account.
        const transactionOptions = { authorization:[`${account.name}@${account.authority}`] };

        eos.transfer(account.name, 'helloworld', '1.0000 EOS', 'memo', transactionOptions).then(trx => {
            // That's it!
            console.log(`Transaction ID: ${trx.transaction_id}`);
        }).catch(error => {
            console.error(error);
        });

    }).catch(error => {
        // The user rejected this request, or doesn't have the appropriate requirements.
        console.error(error);
    });
	});
		
	if(tp.isConnected() == true)
	{
		tp.getWalletList('eos').then(data => {
		var accountcnt = data["wallets"]["eos"].length;
		var $accountlistid = $("#accountlistid");
		$accountlistid.empty();
		for(var i = 0; i <= accountcnt; i++)
		{	
			var accountname = data["wallets"]["eos"][i]["name"];
			$accountlistid.append(new Option(accountname, accountname));
			if(i == 0)
			{
				g_curwalletname = accountname;
			}
		}
		})
	}
	else{
		console.log("tp is not connected!");
	}
}

function WalletChange(obj)
{
	g_curwalletname = $(obj).val();
}

function TableChange(obj)
{
	g_curtable = $(obj).val();
}

function ActionChange(obj)
{
	var type = $(obj).val();
	ActionParamParse(type);
}

function ActionParamParse(action)
{
	var action_type;
	var actioncnt = g_abidata["abi"]["actions"].length;
	for(var i = 0; i < actioncnt; i++)
	{
		if(g_abidata["abi"]["actions"][i]["name"] == action)
		{
			action_type = g_abidata["abi"]["actions"][i]["type"];
			break;
		}
	}
	
	var fields;
	var structcnt = g_abidata["abi"]["structs"].length;
	for(var i = 0; i < structcnt; i++)
	{
		if(g_abidata["abi"]["structs"][i]["name"] == action_type)
		{
			fields = g_abidata["abi"]["structs"][i]["fields"];
			break;
		}
	}
	
	$("#actionparamlistid").empty();
	var fieldcnt = fields.length;
	for(var i = 0; i < fieldcnt; i++)
	{
		var paramdiv = "<div class='row justify-content-center' style='margin:20px auto;'><div class='col-3'><label class='text-right'>"+fields[i]["name"]+"</label></div><div class='col-8'><input placeholder='"+fields[i]["type"]+"'></input></div></div>";
		$("#actionparamlistid").append(paramdiv);
	}
}

function HttpEndPointChange(obj)
{
	EosjsInit();
}

function OperateShow(type)
{
	if(type == 0)
	{
		$("#tableid").hide();
		$("#actionid").show();
	}
	else if(type == 1)
	{
		$("#tableid").show();
		$("#actionid").hide();
	}
}

function OperateChange(obj)
{
	var type = $(obj).val();
	OperateShow(type);
}

function OperateSubmit()
{
	var contract = $("#contractid").val();
	var type = $("#operatetypeid").val();
	if(type == 0)
	{
		try {
			var curaccount = g_curwalletname;
			var action = $("#actionlistid").val();
			var paramdata = '';
			$("#actionparamlistid").find(".row").each(function(){
				paramname = $(this).find("label").html();
				paramval = $(this).find("input").val();
				paramdata += '"'+paramname+'":"'+paramval+'",';
			});
			paramdata = paramdata.substring(0,paramdata.length-1)
			
			var actionstr = '{"actions":[{"account":"'+contract+'","name":"'+action+'","authorization":[{"actor":"'+curaccount+'","permission":"active"}],"data":{'+paramdata+'}}]}';
			console.log("actionstr is "+actionstr);
			var params = JSON.parse(actionstr);
			tp.pushEosAction(params).then(data => {
			  var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
			  $('#logid').html(result);
			});
		}
		catch(e) {
        $("#logid").html(e);
		console.log(e);
		}
	}
	else if(type == 1)
	{
		var scope = $("#scopeid").val();
		var table = $("#tablelistid").val();
		g_eos.getTableRows(true, contract, scope, table, function(error, data){
			if(error == null)
			{
				$("#logid").html(JSON.stringify(data, null, 2));
			}
			else
			{
				$("#logid").html(error);
				console.log(error);
			}
		})
	}
}

function pusheosshishicaiaddlink()
{
	if(tp.isConnected() == true)
	{
		try {
			var curaccount = g_curwalletname;
			var upplayer = $("#upplayer").val();
			var actionstr = '{"actions":[{"account":"eosshishicai","name":"addlink","authorization":[{"actor":"'+curaccount+'","permission":"active"}],"data":{"player":"'+curaccount+'","upplayer": "'+upplayer+'"}}]}';
			var params = JSON.parse(actionstr);
			tp.pushEosAction(params).then(data => {
			  //var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
			  //$('.consoleLog').html(result);
			});
			
		}
		catch(e) {
        //$('.consoleLog').html(e);
		}
	}
	else
	{
		console.log("tp is not connected!");
		
	}
}

function EosjsInit()
{
    var eosConfig = {
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
      httpEndpoint: $("#httpendpointid").val(),
      verbose: true
    }
	
	g_eos = Eos(eosConfig);
}

function GetAbi()
{
	var $contractid = $("#contractid");
	var $tablelistid = $("#tablelistid");
	var $actionlistid = $("#actionlistid");
	$tablelistid.empty();
	$actionlistid.empty();
	$("#tableid").hide();
	$("#actionid").hide();
	g_eos.getAbi($contractid.val(), function(error, data) {
	if(error == null)
	{
		g_abidata = data;
		console.log(JSON.stringify(data, null, 2));
		var tablecnt = data["abi"]["tables"].length;
		for(var i = 0; i < tablecnt; i++)
		{
			var tablename = data["abi"]["tables"][i]["name"];
			$tablelistid.append(new Option(tablename,tablename));
		}
		
		var actioncnt = data["abi"]["actions"].length;
		for(var i = 0; i < actioncnt; i++)
		{
			var actionname = data["abi"]["actions"][i]["name"];
			$actionlistid.append(new Option(actionname,actionname));
		}
		
		$("#operatetypeid").empty();
		$("#operatetypeid").append(new Option("pushaction",0));
		$("#operatetypeid").append(new Option("gettable",1));
		
		OperateShow($("#operatetypeid").val());
		
		ActionParamParse($actionlistid.val());
	}
	else
	{
		$("#logid").html(error);
		console.log(error);
	}
	})
}
