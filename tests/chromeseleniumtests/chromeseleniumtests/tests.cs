/*Tests.cs
 *  tests to check basic features
 * 
 *      Sean Coombes, Kyle Zimmerman, Justin Coschi - 4/5/15 - tests created
 * 
 */

using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
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
            //!Make sure to add the path to where you extracting the chromedriver.exe:
            driver = new ChromeDriver(@"/chromedriver"); //<-Add your path

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
        
        /// <summary>
        /// tests the login feature
        /// </summary>
        [Test]
        public void TheLoginTest()
        {
            register();
            logout();

            driver.Navigate().GoToUrl(baseURL + "/login.html");   
            driver.FindElement(By.CssSelector("#email")).Clear();
            driver.FindElement(By.CssSelector("#email")).SendKeys("j@j.ca");
            driver.FindElement(By.CssSelector("#password")).Clear();
            driver.FindElement(By.CssSelector("#password")).SendKeys("1234");
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

        /// <summary>
        /// tests register feature
        /// </summary>
        [Test]
        public void TheRegisterTest()
        {
            driver.Navigate().GoToUrl(baseURL + "/login.html");
            driver.FindElement(By.CssSelector("#signupbtn")).Click();                
            driver.FindElement(By.CssSelector("#signup-email")).SendKeys("j@j.ca");           
            driver.FindElement(By.CssSelector("#signup-password")).SendKeys("1234");           
            driver.FindElement(By.CssSelector("#confirm-signup-password")).SendKeys("1234");          
            driver.FindElement(By.CssSelector("#signupfname")).SendKeys("sean");          
            driver.FindElement(By.CssSelector("#signuplname")).SendKeys("coombes");          
            driver.FindElement(By.CssSelector("#register")).Click();          
            driver.FindElement(By.CssSelector("#confirmsignup")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#eventfeed > .ui-header.ui-bar-inherit.ui-header-fixed.slidedown > h2.ui-title"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            Assert.IsTrue(Regex.IsMatch(driver.FindElement(By.CssSelector("#eventfeed > .ui-header.ui-bar-inherit.ui-header-fixed.slidedown > h2.ui-title")).Text, "^[\\s\\S]*Event Feed[\\s\\S]*$"));
        }

        /// <summary>
        /// tests the logout feature
        /// </summary>
        [Test]
        public void TheLogoutTest()
        {
            register();

            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("a[href=\"settings.html\"]"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("a[href=\"settings.html\"]")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#logout-button"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#logout-button")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector(".ui-content > h2"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            Assert.IsTrue(Regex.IsMatch(driver.FindElement(By.CssSelector(".ui-content > h2")).Text, "^[\\s\\S]*Login to ClassMate[\\s\\S]*$"));
        }

        /// <summary>
        /// tests create course feature
        /// </summary>
        [Test]
        public void TheCreatecourseTest()
        {
            register();
            createCourse();
            Assert.IsTrue(Regex.IsMatch(driver.FindElement(By.CssSelector("h1.course-code")).Text, "^[\\s\\S]*prog2070-1[\\s\\S]*$"));
        }

        /// <summary>
        /// tests the create event feature
        /// </summary>
        [Test]
        public void TheCreateeventTest()
        {
            register();
            createCourse();

            driver.Navigate().GoToUrl(baseURL + "/create-event.html");
           
            new SelectElement(driver.FindElement(By.Id("eventcourse"))).SelectByText("prog2070");
            driver.FindElement(By.CssSelector("#eventname")).SendKeys("Assignment 6");
            driver.FindElement(By.CssSelector("#eventdue")).SendKeys("2015-04-20");
            driver.FindElement(By.CssSelector("#eventworth")).SendKeys("10");
            driver.FindElement(By.CssSelector("#eventdescription")).SendKeys("this is a tough one");
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#confirmEvent"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#confirmEvent")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("h2.assignment-name"))) break;
                }
                catch (Exception)
                { }
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

        /// <summary>
        /// sets up file to log out if needed for tests
        /// </summary>
        private void logout()
        {
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("a[href=\"settings.html\"]"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("a[href=\"settings.html\"]")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#logout-button"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#logout-button")).Click();
        }
        
        /// <summary>
        /// setup file to create a user account for tests
        /// </summary>
        private void register()
        {
            driver.Navigate().GoToUrl(baseURL + "/login.html");
            driver.FindElement(By.CssSelector("#signupbtn")).Click();
            driver.FindElement(By.CssSelector("#signup-email")).SendKeys("j@j.ca");
            driver.FindElement(By.CssSelector("#signup-password")).SendKeys("1234");
            driver.FindElement(By.CssSelector("#confirm-signup-password")).SendKeys("1234");
            driver.FindElement(By.CssSelector("#signupfname")).SendKeys("sean");
            driver.FindElement(By.CssSelector("#signuplname")).SendKeys("coombes");
            driver.FindElement(By.CssSelector("#register")).Click();
            driver.FindElement(By.CssSelector("#confirmsignup")).Click();
        }

        /// <summary>
        /// sets up courses for tests
        /// </summary>
        private void createCourse()
        {
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("a[href=\"courses.html\"]"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("a[href=\"courses.html\"]")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("a[href=\"add-course.html\"]"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("a[href=\"add-course.html\"]")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#toggle-create-course"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#toggle-create-course")).Click();
            driver.FindElement(By.CssSelector("#course-code")).SendKeys("prog2070");
            driver.FindElement(By.CssSelector("#course-section")).SendKeys("1");
            driver.FindElement(By.CssSelector("#course-name")).SendKeys("QA");
            driver.FindElement(By.CssSelector(".ui-controlgroup-controls > .ui-radio:nth-of-type(2) > label.ui-btn.ui-corner-all.ui-btn-inherit.ui-radio-off")).Click();
            driver.FindElement(By.CssSelector("#course-year")).SendKeys("2015");


            driver.FindElement(By.CssSelector("#teacher-name")).SendKeys("John Doe");
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("#add-course-form > .ui-btn.ui-shadow"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
            driver.FindElement(By.CssSelector("#add-course-form > .ui-btn.ui-shadow")).Click();
            for (int second = 0; ; second++)
            {
                if (second >= 60) Assert.Fail("timeout");
                try
                {
                    if (IsElementPresent(By.CssSelector("h1.course-code"))) break;
                }
                catch (Exception)
                { }
                Thread.Sleep(1000);
            }
        }
    }
}
