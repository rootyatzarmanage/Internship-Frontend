export interface UserInfo {
name: string;
id: string;
}

export interface AnalyticsRecord {
sNo: string;
pageName: string;
pageUrl: string;
previousPage: string;
user: UserInfo;
ipAddress: string;
country: string;
region: string;
city: string;
pinCode: string;
device: string;
operatingSystem: string;
browser: string;
timeZone: string;
durationInSec: number;
viewedAt: string;
}

export const analyticsData: AnalyticsRecord[] = [
{
sNo: "01",
pageName: "Overview",
pageUrl: "/overview",
previousPage: "/",
user: {
name: "Ellis",
id: "89431",
},
ipAddress: "40.78.481.948",
country: "India",
region: "Tamil Nadu",
city: "Coimbatore",
pinCode: "641 004",
device: "Mobile",
operatingSystem: "Android",
browser: "Chrome",
timeZone: "UTC+5:30",
durationInSec: 5005450,
viewedAt: "13 Sept 2026, 10:27 AM",
},
{
sNo: "02",
pageName: "Overview",
pageUrl: "/overview",
previousPage: "/",
user: {
name: "Harry",
id: "89431",
},
ipAddress: "40.78.481.948",
country: "India",
region: "Tamil Nadu",
city: "Coimbatore",
pinCode: "641 004",
device: "Mobile",
operatingSystem: "Android",
browser: "Chrome",
timeZone: "UTC+5:30",
durationInSec: 5005450,
viewedAt: "13 Sept 2026, 10:27 AM",
},
{
sNo: "03",
pageName: "Overview",
pageUrl: "/overview",
previousPage: "/",
user: {
name: "Osborn",
id: "89431",
},
ipAddress: "40.78.481.948",
country: "India",
region: "Tamil Nadu",
city: "Coimbatore",
pinCode: "641 004",
device: "Mobile",
operatingSystem: "Android",
browser: "Chrome",
timeZone: "UTC+5:30",
durationInSec: 5005450,
viewedAt: "13 Sept 2026, 10:27 AM",
},
{
sNo: "04",
pageName: "Overview",
pageUrl: "/overview",
previousPage: "/",
user: {
name: "Mary Jane",
id: "89431",
},
ipAddress: "40.78.481.948",
country: "India",
region: "Tamil Nadu",
city: "Coimbatore",
pinCode: "641 004",
device: "Mobile",
operatingSystem: "Android",
browser: "Chrome",
timeZone: "UTC+5:30",
durationInSec: 5005450,
viewedAt: "13 Sept 2026, 10:27 AM",
},
{
sNo: "05",
pageName: "Overview",
pageUrl: "/overview",
previousPage: "/",
user: {
name: "Ursula",
id: "89431",
},
ipAddress: "40.78.481.948",
country: "India",
region: "Tamil Nadu",
city: "Coimbatore",
pinCode: "641 004",
device: "Mobile",
operatingSystem: "Android",
browser: "Chrome",
timeZone: "UTC+5:30",
durationInSec: 5005450,
viewedAt: "13 Sept 2026, 10:27 AM",
},
{
sNo: "06",
pageName: "Overview",
pageUrl: "/overview",
previousPage: "/",
user: {
name: "Stacy",
id: "89431",
},
ipAddress: "40.78.481.948",
country: "India",
region: "Tamil Nadu",
city: "Coimbatore",
pinCode: "641 004",
device: "Mobile",
operatingSystem: "Android",
browser: "Chrome",
timeZone: "UTC+5:30",
durationInSec: 5005450,
viewedAt: "13 Sept 2026, 10:27 AM",
},
];