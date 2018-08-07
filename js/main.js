function main(){
    console.log("enter main");
	var result = null;
    if(tp.isConnected() == true)
	{
		$("#constatus").text("已连接").css('color', 'green');
		
		tp.getWalletList('eos').then(data => {
		var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
        $('.consoleLog').html(result);
		var accountCnt = data["wallets"]["eos"].length;
		var $accountList = $("#accountlist");
		$accountList.empty();
		for(var i=0;i<=accountCnt;i++)
		{	
			var accountName = data["wallets"]["eos"][i]["name"];
			var accountEosBalance = data["wallets"]["eos"][i]["tokens"]["EOS"];
			$accountList.append(new Option(accountName+" "+accountEosBalance+" EOS",accountName));
		}
		})
		
		//push action
		$("#actionInput").val('{"actions":[{"account":"eosio","name":"buyram","authorization":[{"actor":"wayunggogogo","permission":"active"}],"data":{"payer":"wayunggogogo","receiver":"wayunggogogo", "quant":"0.1000 EOS"}}]}');
		
		result = JSON.stringify(JSON.parse($("#actionInput").val()), null, 2);
		
		$("#actionText").html(result);
	}
	else
	{
		$("#constatus").text("请在TP钱包开发者模式下打开此网页").css('color', 'red')
	}
}

function transfer()
{
	if(tp.isConnected() == true)
	{
	tp.eosTokenTransfer({
    from: 'wayunggogogo',
    to: 'wayungmihoko',
    amount: '0.0001',
    tokenName: 'EOS',
    precision: 4,
    contract: 'eosio.token',
    memo: 'test'
	});
	}
}

function accountChange()
{
	if(tp.isConnected() == true)
	{
	try {
	tp.getEosBalance({
    account: $("#accountlist").val(),
    contract: 'eosio.token',
    symbol: 'EOS'
	}).then(data => {
		var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
        $('.consoleLog').html(result);
		$("#balanceval").text(data["data"]["balance"]);
      })
	}
	catch(e) {
		$('.consoleLog').html(e);
      }
	}
}

function pushAction()
{
	try {
        var params = JSON.parse($("#actionText").val());
        tp.pushEosAction(params).then(data => {
          var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
          $('.consoleLog').html(result);
        })
      }
      catch(e) {
        $('.consoleLog').html(e);
      }
	
}

function getTable()
{
	try {
        var str = '{"json": true, "code": "'+ $("#tableContract").val() + '", "scope": "' + $("#tableScope").val() + '","table": "' + $("#tableName").val() + '","limit": 30}';
		var params = JSON.parse(str);
        tp.getTableRows(params).then(data => {
		  var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
          $('.consoleLog').html(result);
        })
      }
      catch(e) {
        $('.consoleLog').html(e);
      }
	
}