import re
from playwright.sync_api import sync_playwright, expect
import sys

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        base_url = "http://localhost:3000"

        # 1. Verify Footer Link Removal
        print("Checking footer for admin link...")
        page.goto(base_url)
        # Give the page time to load
        page.wait_for_load_state('networkidle', timeout=15000)

        footer = page.locator("footer")
        admin_link = footer.get_by_role("link", name=re.compile("لوحة التحكم|admin dashboard", re.IGNORECASE))

        expect(admin_link).not_to_be_visible()
        print("✅ Admin dashboard link is not visible in the footer.")
        page.screenshot(path="jules-scratch/verification/01-footer-no-admin-link.png")

        # 2. Login with new admin credentials
        print("\nNavigating to login page to test new admin...")
        page.goto(f"{base_url}/admin/login")

        # Wait for the login form to be ready
        login_heading = page.get_by_role("heading", name=re.compile("admin login|تسجيل دخول الإدارة", re.IGNORECASE))
        expect(login_heading).to_be_visible(timeout=20000)
        print("Login page loaded.")

        page.fill('input[name="email"]', '0saif0303@clutchzone-admin.com')
        page.fill('input[name="password"]', 'maxstorm@012')
        page.get_by_role("button", name=re.compile("sign in|تسجيل الدخول", re.IGNORECASE)).click()
        print("Attempting to log in with new admin credentials...")

        # Wait for dashboard to load after login
        dashboard_heading = page.get_by_role("heading", name=re.compile("dashboard|لوحة التحكم", re.IGNORECASE))
        expect(dashboard_heading).to_be_visible(timeout=15000)
        print("✅ Logged in successfully with new admin user.")
        page.screenshot(path="jules-scratch/verification/02-admin-login-success.png")

        # 3. Add a new car and verify it appears on the public page
        print("\nNavigating to Add Car page...")
        # Use a more robust selector for navigation
        page.locator('a[href="/admin/add-car"]').click()
        add_car_heading = page.get_by_role("heading", name=re.compile("add new car|إضافة سيارة جديدة", re.IGNORECASE))
        expect(add_car_heading).to_be_visible()

        car_title = "Test Car - Toyota Camry 2024"
        print(f"Adding new car: '{car_title}'")
        page.fill('input[name="make"]', 'Toyota')
        page.fill('input[name="model"]', 'Camry')
        page.fill('input[name="year"]', '2024')
        page.fill('input[name="price"]', '2500000')
        page.fill('textarea[name="description"]', 'A brand new test car for verification.')

        image_path = 'jules-scratch/verification/test-image.jpg'
        page.set_input_files('input[type="file"]', image_path)
        expect(page.locator('img[alt="Preview"]')).to_be_visible()

        page.get_by_role("button", name=re.compile("add car|إضافة السيارة", re.IGNORECASE)).click()
        expect(page.get_by_text(re.compile("car added successfully|تم إضافة السيارة بنجاح", re.IGNORECASE))).to_be_visible(timeout=15000)
        print("✅ Car added successfully via admin panel.")

        # Wait for navigation back to the dashboard
        expect(dashboard_heading).to_be_visible(timeout=10000)

        # Navigate to the public cars page to verify
        print("\nVerifying new car appears on the public cars page...")
        page.goto(f"{base_url}/cars")

        # Wait for the car list to be visible and check for the new car's title
        expect(page.get_by_text(car_title)).to_be_visible(timeout=15000)
        print("✅ New car is visible on the public page.")
        page.screenshot(path="jules-scratch/verification/03-car-listing-visible.png")

        print("\n🎉 Verification script completed successfully! All checks passed.")

    except Exception as e:
        print(f"❌ An error occurred during verification: {e}", file=sys.stderr)
        page.screenshot(path="jules-scratch/verification/error.png")
        # Re-raise the exception to ensure the script exits with a non-zero code
        raise
    finally:
        browser.close()

with sync_playwright() as p:
    run_verification(p)