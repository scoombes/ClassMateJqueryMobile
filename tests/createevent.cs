using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;

namespace SeleniumTests
{
    [TestFixture]
    public class Createevent
    {
        private IWebDriver driver;
        private StringBuilder verificationErrors;
        private string baseURL;
        private bool acceptNextAlert = true;
        
        [SetUp]
        public void SetupTest()
        {
            driver = new FirefoxDriver();
            baseURL = "http://192.168.56.1:8080";
            verificationErrors = new StringBuilder();
        }
        
        [TearDown]
        public void TeardownTest()
        {
            try
            {
                driver.Quit();
            }
            catch (Exception)
            {
                // Ignore errors if unable to close the browser
            }
            Assert.AreEqual("", verificationErrors.ToString());
        }
        
        [Test]
        public void TheCreateeventTest()
        {
            driver.Navigate().GoToUrl(baseURL + "/create-event.html");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventcourse"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#eventcourse")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventcourse"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#eventcourse")).Clear();
            driver.FindElement(By.CssSelector("#eventcourse")).SendKeys("1");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventname"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#eventname")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventname"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#eventname")).Clear();
            driver.FindElement(By.CssSelector("#eventname")).SendKeys("Assignment 6");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventdue"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#eventdue")).Clear();
            driver.FindElement(By.CssSelector("#eventdue")).SendKeys("2015-04-20");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventworth"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#eventworth")).Clear();
            driver.FindElement(By.CssSelector("#eventworth")).SendKeys("10");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventdescription"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#eventdescription")).Clear();
            driver.FindElement(By.CssSelector("#eventdescription")).SendKeys("this is a tough one");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#confirmsignup"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#confirmsignup")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("h2.assignment-name"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            Assert.IsTrue(Regex.IsMatch(driver.FindElement(By.CssSelector("h2.assignment-name")).Text, "^[\\s\\S]*Assignment 6[\\s\\S]*$"));
        }
        private bool IsElementPresent(By by)
        {
            try
            {
                driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }
        
        private bool IsAlertPresent()
        {
            try
            {
                driver.SwitchTo().Alert();
                return true;
            }
            catch (NoAlertPresentException)
            {
                return false;
            }
        }
        
        private string CloseAlertAndGetItsText() {
            try {
                IAlert alert = driver.SwitchTo().Alert();
                string alertText = alert.Text;
                if (acceptNextAlert) {
                    alert.Accept();
                } else {
                    alert.Dismiss();
                }
                return alertText;
            } finally {
                acceptNextAlert = true;
            }
        }
    }
}
