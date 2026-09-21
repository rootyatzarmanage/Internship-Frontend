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
    previousPage: "/login",
    user: {
      name: "Ellis",
      id: "89431",
    },
    ipAddress: "104.28.19.45",
    country: "United States",
    region: "California",
    city: "San Francisco",
    pinCode: "94105",
    device: "Desktop",
    operatingSystem: "macOS",
    browser: "Chrome",
    timeZone: "UTC-7:00",
    durationInSec: 142,
    viewedAt: "01 Sept 2026, 10:27 AM",
  },
  {
    sNo: "02",
    pageName: "Dashboard",
    pageUrl: "/dashboard",
    previousPage: "/overview",
    user: {
      name: "Harry",
      id: "78204",
    },
    ipAddress: "49.37.152.18",
    country: "India",
    region: "Tamil Nadu",
    city: "Coimbatore",
    pinCode: "641004",
    device: "Mobile",
    operatingSystem: "Android",
    browser: "Chrome",
    timeZone: "UTC+5:30",
    durationInSec: 85,
    viewedAt: "05 Sept 2026, 11:15 AM",
  },
  {
    sNo: "03",
    pageName: "Settings",
    pageUrl: "/settings/profile",
    previousPage: "/dashboard",
    user: {
      name: "Osborn",
      id: "45119",
    },
    ipAddress: "82.165.197.1",
    country: "Germany",
    region: "Bavaria",
    city: "Munich",
    pinCode: "80331",
    device: "Desktop",
    operatingSystem: "Windows",
    browser: "Firefox",
    timeZone: "UTC+2:00",
    durationInSec: 320,
    viewedAt: "09 Sept 2026, 01:40 PM",
  },
  {
    sNo: "04",
    pageName: "Analytics",
    pageUrl: "/reports/analytics",
    previousPage: "/overview",
    user: {
      name: "Mary Jane",
      id: "10923",
    },
    ipAddress: "192.206.151.131",
    country: "Canada",
    region: "Ontario",
    city: "Toronto",
    pinCode: "M5V 2T6",
    device: "Tablet",
    operatingSystem: "iOS",
    browser: "Safari",
    timeZone: "UTC-4:00",
    durationInSec: 610,
    viewedAt: "13 Sept 2026, 03:05 PM",
  },
  {
    sNo: "05",
    pageName: "User Profile",
    pageUrl: "/users/ursula",
    previousPage: "/users/list",
    user: {
      name: "Ursula",
      id: "63482",
    },
    ipAddress: "185.220.101.5",
    country: "United Kingdom",
    region: "Greater London",
    city: "London",
    pinCode: "EC1A 1BB",
    device: "Desktop",
    operatingSystem: "macOS",
    browser: "Edge",
    timeZone: "UTC+1:00",
    durationInSec: 45,
    viewedAt: "13 Sept 2026, 04:50 PM",
  },
  {
    sNo: "06",
    pageName: "Billing",
    pageUrl: "/settings/billing",
    previousPage: "/settings/profile",
    user: {
      name: "Stacy",
      id: "92104",
    },
    ipAddress: "121.244.40.12",
    country: "India",
    region: "Karnataka",
    city: "Bengaluru",
    pinCode: "560001",
    device: "Mobile",
    operatingSystem: "iOS",
    browser: "Safari",
    timeZone: "UTC+5:30",
    durationInSec: 198,
    viewedAt: "13 Sept 2026, 06:12 PM",
  },
];