var g_currenwalletname = '';
function main(){
	if(tp.isConnected() == true)
	{
		tp.getWalletList('eos').then(data => {
		var accountCnt = data["wallets"]["eos"].length;
		var $accountList = $("#accounts");
		$accountList.empty();
		for(var i=0;i<=accountCnt;i++)
		{	
			var accountName = data["wallets"]["eos"][i]["name"];
			$accountList.append(new Option(accountName,accountName));
			if(i == 0)
			{
				g_currenwalletname = accountName;
			}
		}
		})
	}
	else{
		console.log("tp is not connected!");
	}
}

function walletchange(obj)
{
	g_currenwalletname = $(obj).val();
}

function pusheosshishicaiaddlink()
{
	if(tp.isConnected() == true)
	{
		try {
			var curaccount = g_currenwalletname;
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
