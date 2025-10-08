import re
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # The server runs on 10000, but the client dev server is on 3000
        base_url = "http://localhost:3000"

        # 1. Login
        print("Navigating to login page...")
        page.goto(f"{base_url}/admin/login")
        page.wait_for_selector('input[name="email"]')
        page.fill('input[name="email"]', 'admin@clutchzone.com')
        page.fill('input[name="password"]', 'maxstorm@012')
        page.get_by_role("button", name=re.compile("login", re.IGNORECASE)).click()
        print("Logged in successfully.")

        # Wait for dashboard to load
        expect(page.get_by_role("heading", name=re.compile("dashboard", re.IGNORECASE))).to_be_visible(timeout=10000)
        print("Dashboard loaded.")

        # 2. Add a new car
        print("Navigating to Add Car page...")
        page.get_by_role("link", name=re.compile("add new car", re.IGNORECASE)).click()

        expect(page.get_by_role("heading", name=re.compile("add new car", re.IGNORECASE))).to_be_visible()
        print("Add Car page loaded.")

        page.fill('input[name="title"]', 'Test Car - BMW X5')
        page.fill('input[name="price"]', '1500000')
        page.fill('input[name="year"]', '2023')
        page.fill('input[name="mileage"]', '15000')
        page.select_option('select[name="transmission"]', 'Automatic')
        page.select_option('select[name="fuel"]', 'Petrol')
        page.fill('textarea[name="description"]', 'A great test car for sale.')
        page.get_by_role("button", name=re.compile("add feature", re.IGNORECASE)).click()
        page.locator('input[placeholder="Enter a feature"]').nth(0).fill("Test Feature 1")
        page.locator('input[placeholder="Enter a feature"]').nth(1).fill("Test Feature 2")

        # Upload image
        image_path = 'jules-scratch/verification/test-image.jpg'
        page.set_input_files('input[type="file"]', image_path)
        expect(page.locator('img[alt="Preview"]')).to_be_visible()
        print("Image selected for car.")

        page.get_by_role("button", name=re.compile("add car", re.IGNORECASE)).click()
        expect(page.get_by_text("Car added successfully")).to_be_visible(timeout=10000)
        print("Car added successfully.")

        # Wait to be redirected to the dashboard
        expect(page.get_by_role("heading", name=re.compile("dashboard", re.IGNORECASE))).to_be_visible(timeout=10000)

        # 3. Add a new property
        print("Navigating to Add Property page...")
        page.get_by_role("link", name=re.compile("add new property", re.IGNORECASE)).click()

        expect(page.get_by_role("heading", name=re.compile("add new property", re.IGNORECASE))).to_be_visible()
        print("Add Property page loaded.")

        page.fill('input[name="title"]', 'Test Property - Luxury Villa')
        page.fill('input[name="price"]', '5000000')
        page.fill('input[name="location"]', 'Cairo')
        page.fill('input[name="bedrooms"]', '5')
        page.fill('input[name="bathrooms"]', '4')
        page.fill('input[name="area"]', '350')
        page.fill('textarea[name="description"]', 'A great test property for sale.')

        # Upload image
        page.set_input_files('input[type="file"]', image_path)
        expect(page.locator('img[alt="Preview"]')).to_be_visible()
        print("Image selected for property.")

        page.get_by_role("button", name=re.compile("add property", re.IGNORECASE)).click()
        expect(page.get_by_text("Property added successfully")).to_be_visible(timeout=10000)
        print("Property added successfully.")

        # Wait to be redirected to the dashboard
        expect(page.get_by_role("heading", name=re.compile("dashboard", re.IGNORECASE))).to_be_visible(timeout=10000)
        print("Returned to dashboard.")
        page.screenshot(path="jules-scratch/verification/verification-dashboard.png")

        # 4. Update Settings
        print("Navigating to Settings page...")
        page.get_by_role("link", name=re.compile("settings", re.IGNORECASE)).click()
        expect(page.get_by_role("heading", name=re.compile("settings", re.IGNORECASE))).to_be_visible()
        print("Settings page loaded.")

        page.fill('input[name="contact.phone"]', '01234567890')
        page.fill('input[name="contact.email"]', 'test@clutchzone.com')
        page.get_by_role("button", name=re.compile("save changes", re.IGNORECASE)).click()
        expect(page.get_by_text("Settings updated successfully!")).to_be_visible(timeout=10000)
        print("Settings updated successfully.")
        page.screenshot(path="jules-scratch/verification/verification-settings.png")

        # 5. Verify public pages load
        print("Verifying public pages...")
        page.goto(f"{base_url}/cars")
        expect(page.get_by_role("heading", name=re.compile("cars", re.IGNORECASE))).to_be_visible()
        expect(page.get_by_text("Test Car - BMW X5")).to_be_visible()
        print("Cars page loaded with new car.")

        page.goto(f"{base_url}/properties")
        expect(page.get_by_role("heading", name=re.compile("properties", re.IGNORECASE))).to_be_visible()
        expect(page.get_by_text("Test Property - Luxury Villa")).to_be_visible()
        print("Properties page loaded with new property.")

        print("Verification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

with sync_playwright() as p:
    run_verification(p)