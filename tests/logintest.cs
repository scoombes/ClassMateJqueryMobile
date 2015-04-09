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
    public class Logintest
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
        public void TheLoginTest()
        {
            driver.Navigate().GoToUrl(baseURL + "/login.html");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#email"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#email")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#login"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#login")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#email"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#email")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#email"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#email")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#email"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#email")).Clear();
            driver.FindElement(By.CssSelector("#email")).SendKeys("seancoombes@live.ca");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#password"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#password")).Clear();
            driver.FindElement(By.CssSelector("#password")).SendKeys("1234");
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#loginbtn"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#loginbtn")).Click();
            for (int second = 0;; second++) {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventfeed > .ui-header.ui-bar-inherit.ui-header-fixed.slidedown > h2.ui-title"))) break;
                }
                catch (Exception)
                {}
                Thread.Sleep(1000);
            }
            Assert.IsTrue(Regex.IsMatch(driver.FindElement(By.CssSelector("#eventfeed > .ui-header.ui-bar-inherit.ui-header-fixed.slidedown > h2.ui-title")).Text, "^[\\s\\S]*Event Feed[\\s\\S]*$"));
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
