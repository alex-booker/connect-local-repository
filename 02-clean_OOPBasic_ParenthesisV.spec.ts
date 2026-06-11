import { test, expect } from '@playwright/test'; 

// Build a TestUser class with email, role, fullName() and Make all fields private; expose only what tests need.
// Make two users; pass them into a login test.
// Add a global cleanup that runs after each test, regardless of pass/fail.
// Add parenthesis validator class with a diagnose() method that returns a string diagnosis of the input.

// ── Class ParenthesisValidator ──────────────────────────────────────
class ParenthesisValidator {
  diagnose(input: string): string {
    if (input === null || input === undefined) {
      throw new Error("Input cannot be null or undefined.");
    }
    if (input === "") {
      return "The string is empty — considered valid.";
    }

    const stack: string[] = [];
    const map: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

    for (const char of input) {
      if ('([{'.includes(char)) {
        stack.push(char);
      } else if (')]}'.includes(char)) {
        if (stack.pop() !== map[char]) {
          return `"${input}" has invalid parentheses.`;
        }
      }
    }

    return stack.length === 0
      ? `"${input}" has valid parentheses.`
      : `"${input}" has invalid parentheses.`;
  }
}

// ── TestUser privadas───────────────────────────────────────────────
class TestUser { 

  private email: string; 
  private role: string; 
  private firstName: string; 
  private lastName: string;
  
  constructor(email: string, role: string, firstName: string, lastName: string) 
  { 

    this.email     = email; 
    this.role      = role; 
    this.firstName = firstName; 
    this.lastName  = lastName; 

  } 

  // Only expose what tests need 

  getEmail(): string  { return this.email; } 
  getRole(): string   { return this.role; } 
  fullName(): string  { return `${this.firstName} ${this.lastName}`; } 

} 


// ── Const ────────────────────────────────────────────────── 

const adminUser  = new TestUser('Mariana.admin@test.com',  'admin',  'Mariana', 'Test'); 
const regularUser = new TestUser('Booker.viewer@test.com', 'viewer', 'Booker', 'Test'); 
const validator   = new ParenthesisValidator(); 

// ── Cleanup global (equivalente a finally para todos los tests) ───
test.afterEach(async ({ page }, testInfo) => {
  console.log(`Cleanup ejecutado después de: "${testInfo.title}" — Status: ${testInfo.status}`);
  await page.goto('https://www.saucedemo.com/');

    // Solo redirige al login si es un test de UI
  if (!testInfo.title.includes('diagnose')) {
    await page.goto('https://www.saucedemo.com/');
  }
});

// ── Tests de login en saucedemo - Admin User ───────────────────────────────────────────────────── 

test('admin user can log in and sees dashboard', async ({ page }) => { 

  await page.goto('https://www.saucedemo.com/'); 
  await page.fill('[data-test=username]', 'performance_glitch_user');
    // adminUser.getEmail()); 
  await page.fill('[data-test=password]', 'secret_sauce'); 
  await page.click('[data-test=login-button]'); 

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test=title]')).toHaveText('Products');

}); 

  // ── Tests de login en saucedemo - regular User ───────────────────────────────────────────────────── 
test('viewer user is redirected to read-only view', async ({ page }) => { 

  await page.goto('https://www.saucedemo.com/'); 
  await page.fill('[data-test=username]', 'visual_user');
    //regularUser.getEmail()); 
  await page.fill('[data-test=password]', 'secret_sauce'); 
  await page.click('[data-test=login-button]'); 

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test=title]')).toHaveText('Products');

console.log(adminUser); // Mariana
console.log(regularUser); // Booker

}); 

// ── Tests de lógica Parentesis: diagnose() ───────────────────────────────
test.describe("diagnose()", () => {
  test("should return valid message for correct brackets", () => {
    const result = validator.diagnose("()[]{}");
    expect(result).toBe('"()[]{}\" has valid parentheses.');
  });

  test("should return invalid message for incorrect brackets", () => {
    const result = validator.diagnose("(]");
    expect(result).toBe('"(]" has invalid parentheses.');
  });

  test("should handle empty string in diagnose", () => {
    const result = validator.diagnose("");
    expect(result).toBe("The string is empty — considered valid.");
  });

  test("should throw in diagnose when input is null", () => {
    expect(() => validator.diagnose(null as unknown as string)).toThrow(
      "Input cannot be null or undefined."
    );
  });
});

// adding comments to new GitBranch
// adding conflitc with Merge
// adding conflitc with Merge
// adding conflitc with Merge
// adding conflitc with Merge
// adding conflitc with Merge

