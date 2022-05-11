include "Locomotive.gs"
include "Browser.gs"
include "lightup.gs"
include "Soup.gs"

class PrimaryScript isclass Locomotive
{
  Asset html;
  Browser browser;
  Message message;
  Soup ourSoup;
  Train train = GetMyTrain();

	string[] trainName;
	float[] pansval;

//---V--------------------SOUP INITIALIZE--------------------V---
public void SetProperties(Soup soup)
{
	inherited(soup);
	Train train = GetMyTrain();
	string trainName = train.GetTrainDisplayName();
	string thispan1 = trainName + "anim1";
	string thispan2 = trainName + "anim2";
	float pan1fr = GetMeshAnimationFrame("anim1");
	float pan2fr = GetMeshAnimationFrame("anim2");

	soup.SetNamedTag(thispan1,pan1fr);
	soup.SetNamedTag(thispan2,pan2fr);
}
//---V------------------GET SOUP PROPERTIES------------------V---
public Soup GetProperties(void)
{
	Soup soup = inherited();
	return soup;
}
//---V-------------------OPEN/CLOSE BROWSER------------------V---
	public void MyViewDetails(Message msg)
	{
		if (!browser) browser = Constructors.NewBrowser();
		browser.SetWindowRect(200,200,580,400);
		browser.LoadHTMLFile(html,"html1.html");
	}

	void BrowserClose(Message msg)
	{
		if (msg.src == browser)
			browser = null;
	}

//---V-----------------PANTOGRAPH CONTROLLER-----------------V---
public void BrowserLink(Message msg) 
		{
			if (msg.src == browser and browser != null)
			{
				Soup soup;
				float pansval = Str.ToFloat(browser.GetElementProperty("panstate","value"));
				Train train = GetMyTrain();
				string trainName = train.GetTrainDisplayName();
				string thispan1 = trainName + "anim1";
				string thispan2 = trainName + "anim2";
				float pan1fr = GetMeshAnimationFrame("anim1");
				float pan2fr = GetMeshAnimationFrame("anim2");

				if (msg.minor == "live://dial/panstate")
				{
					if (pansval <= 0.05 and pansval >= -0.05)
					{
						SetMeshAnimationFrame("anim1",0, 0.25);
						SetMeshAnimationFrame("anim2",0, 0.25);
						soup.SetNamedTag(thispan1, pan1fr);
						soup.SetNamedTag(thispan1, pan2fr);
						SendMessage(train, "TMSTScript" ,"PanUpdate");
					}
					else 
					{
						if (pansval > 0.05)
						{
							SetMeshAnimationFrame("anim1", Math.Fabs(pansval), 0.5);
							SetMeshAnimationFrame("anim2",0, 0.35);
							soup.SetNamedTag(thispan1, pan1fr);
							soup.SetNamedTag(thispan1, pan2fr);
							SendMessage(train, "TMSTScript" ,"PanUpdate");
						}
						if (pansval < -0.05)
						{
							SetMeshAnimationFrame("anim2", Math.Fabs(pansval) ,0.5);
							SetMeshAnimationFrame("anim1",0, 0.35);
							soup.SetNamedTag(thispan1, pan1fr);
							soup.SetNamedTag(thispan1, pan2fr);
							SendMessage(train, "TMSTScript" ,"PanUpdate");
						}
					}
				}
			}
		}
//---V-----------------------REFRESHPAN----------------------V---
public void RefreshPan(Message msg)
{
	Soup soup;
	Train train = GetMyTrain();
	string trainName = train.GetTrainDisplayName();
	string thispan1 = trainName + "anim1";
	string thispan2 = trainName + "anim2";
	float pan1soup = soup.GetNamedTagAsFloat(thispan2);
	float pan2soup = soup.GetNamedTagAsFloat(thispan2);

	if (msg.src != me)
	{
	SetMeshAnimationFrame("anim1",pan1soup, 1);
	SetMeshAnimationFrame("anim2",pan2soup, 1);
	}
}
//---V-----------------------INITIALIZE----------------------V---
	void Init(void)
	{
  	inherited();
  	html = GetAsset().FindAsset("html");
		AddHandler(me, "Browser-Closed", null, "BrowserClose");
  	AddHandler(me, "Browser-URL", null, "BrowserLink");
  	AddHandler(me, "MapObject", "View-Details", "MyViewDetails");
		AddHandler(me, "TMSTscript", "PanUpdate", "RefreshPan");

		//soup stuff
		ourSoup = Constructors.NewSoup();
	}

};
