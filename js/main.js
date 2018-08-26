var g_curwalletname = '';
var g_curtable = '';
var g_curaction = '';
var g_eos = '';
function Main(){
	EosjsInit();
	
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
	g_curaction = $(obj).val();
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
      httpEndpoint: 'http://openapi.eos.ren',
      verbose: true
    }
	
	g_eos = Eos(eosConfig);
}

function GetAbi()
{
	var $contractid = $("#contractid");
	var $tablelistid = $("#tablelistid");
	var $actionlistid = $("#actionlistid");
	g_eos.getAbi($contractid.val(), function(error, data) {
	if(error == null)
	{
		console.log(JSON.stringify(data, null, 2));
		var tablecnt = data["tables"].length;
		for(var i = 0; i < tablecnt; i++)
		{
			var tablename = data["tables"][i]["name"];
			$tablelistid.append(new Option(tablename,tablename));
		}
		
		var actioncnt = data["actions"].length;
		for(var i = 0; i < actioncnt; i++)
		{
			var actionname = data["actions"][i]["name"];
			$actionlistid.append(new Option(actionname,actionname));
		}
	}
	else
	{
		console.log(err);
		$tablelistid.empty();
		$actionlistid.empty();
		
	}
	})
}
