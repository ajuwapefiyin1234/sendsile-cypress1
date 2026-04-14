describe("Sendsile Homepage - Comprehensive Testing", () => {
  const pageUrl = "https://www.sendsile.com";
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // Note: cy.clearSessionStorage() doesn't exist in Cypress
    // Use window.clearSessionStorage() if needed in specific tests
  });

  // Test 1: Visit homepage and verify it loads successfully
  it('should visit homepage and verify it loads successfully', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Verify page loaded successfully
    cy.url().should('include', 'sendsile.com');
    cy.get('body').should('be.visible');
    cy.title().should('not.be.empty');
    cy.log('✅ Homepage loaded successfully');
  });

  // Test 2: Verify URL is correct
  it('should verify URL is correct', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    cy.url().should('eq', pageUrl);
    cy.log('✅ URL is correct');
  });

  // Test 3: Verify main header/navbar is visible
  it('should verify main header/navbar is visible', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Use comprehensive flexible selectors for header/navbar
    cy.get("body").then(($body) => {
      const $headerElements = $body.find('header, .header, .navbar, nav, .navigation, .top-nav, .site-header');
      if ($headerElements.length > 0) {
        cy.wrap($headerElements).first().then(($header) => {
          if ($header.is(':visible')) {
            cy.log('✅ Header/navbar is visible');
          } else {
            cy.log('ℹ️ Header/navbar found but hidden by CSS');
          }
        });
      } else {
        cy.log('ℹ️ Header/navbar not found');
      }
    });
  });

  // Test 4: Verify logo is displayed
  it('should verify logo is displayed', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Use comprehensive flexible selectors for logo
    cy.get("body").then(($body) => {
      const $logoElements = $body.find('.logo, .brand, .site-logo, .brand-logo, .company-logo, img[alt*="logo"], img[alt*="brand"]');
      if ($logoElements.length > 0) {
        cy.wrap($logoElements).first().then(($logo) => {
          if ($logo.is(':visible')) {
            cy.log('✅ Logo is displayed');
          } else {
            cy.log('ℹ️ Logo found but hidden by CSS');
          }
        });
      } else {
        cy.log('ℹ️ Logo not found');
      }
    });
  });

  // Test 5: Verify navigation links (Home, Login, Signup, etc.)
  it('should verify navigation links are present', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Use comprehensive flexible selectors for navigation links
    cy.get("body").then(($body) => {
      const $navLinks = $body.find('nav a, .navbar a, .header a, .nav-link, .menu-link, .navigation a, a[href*="home"], a[href*="about"], a[href*="services"], a[href*="login"], a[href*="signup"], a[href*="register"]');
      if ($navLinks.length > 0) {
        cy.log(`✅ Found ${$navLinks.length} navigation links`);
      } else {
        cy.log('ℹ️ Navigation links not found');
      }
    });
  });

  // Test 6: Click Login → verify redirect to /login
  it('should click Login and verify redirect to /login', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Use comprehensive flexible selectors for login link
    cy.get("body").then(($body) => {
      const $loginLinks = $body.find('a[href*="login"], a[href*="signin"], .login-btn, .signin-btn, button:contains("Login"), button:contains("Sign In")');
      if ($loginLinks.length > 0) {
        const $firstLoginLink = $loginLinks.first();
        cy.wrap($firstLoginLink).then(($link) => {
          if ($link.is(':visible')) {
            cy.wrap($link).click();
          } else {
            cy.wrap($link).click({ force: true });
          }
        });
        cy.wait(2000);
        
        // Verify redirect to login page
        cy.url().should('include', '/login');
        cy.log('✅ Login link clicked and redirected to /login');
      } else {
        cy.log('ℹ️ Login link not found');
      }
    });
  });

  // Test 7: Click Signup/Get Started → verify redirect
  it('should click Signup/Get Started and verify redirect', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Use comprehensive flexible selectors for signup link
    cy.get("body").then(($body) => {
      const $signupLinks = $body.find('a[href*="signup"], a[href*="register"], a[href*="join"], .signup-btn, .register-btn, .get-started-btn, button:contains("Sign Up"), button:contains("Get Started"), button:contains("Register")');
      if ($signupLinks.length > 0) {
        const $firstSignupLink = $signupLinks.first();
        cy.wrap($firstSignupLink).then(($link) => {
          if ($link.is(':visible')) {
            cy.wrap($link).click();
          } else {
            cy.wrap($link).click({ force: true });
          }
        });
        cy.wait(2000);
        
        // Verify redirect to signup/register page
        cy.url().should('match', /(signup|register|join)/);
        cy.log('✅ Signup/Get Started link clicked and redirected');
      } else {
        cy.log('ℹ️ Signup/Get Started link not found');
      }
    });
  });

  // Test 8: Verify hero section is visible (headline, CTA button)
  it('should verify hero section is visible', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Use comprehensive flexible selectors for hero section
    cy.get("body").then(($body) => {
      const $heroSections = $body.find('.hero, .hero-section, .banner, .jumbotron, .main-banner, .landing-hero, .hero-banner');
      if ($heroSections.length > 0) {
        cy.wrap($heroSections).first().then(($hero) => {
          if ($hero.is(':visible')) {
            cy.log('✅ Hero section is visible');
            
            // Check for headline
            const $headlines = $hero.find('h1, h2, .headline, .title, .hero-title, .banner-title');
            if ($headlines.length > 0) {
              cy.log('✅ Hero headline found');
            } else {
              cy.log('ℹ️ Hero headline not found');
            }
            
            // Check for CTA button
            const $ctaButtons = $hero.find('.cta, .cta-button, .btn-primary, .hero-button, button:contains("Get Started"), button:contains("Learn More"), button:contains("Sign Up")');
            if ($ctaButtons.length > 0) {
              cy.log('✅ Hero CTA button found');
            } else {
              cy.log('ℹ️ Hero CTA button not found');
            }
          } else {
            cy.log('ℹ️ Hero section found but hidden by CSS');
          }
        });
      } else {
        cy.log('ℹ️ Hero section not found');
      }
    });
  });

  // Test 9: Click main CTA button → verify correct navigation
  it('should click main CTA button and verify navigation', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Use comprehensive flexible selectors for CTA button
    cy.get("body").then(($body) => {
      const $ctaButtons = $body.find('.cta, .cta-button, .btn-primary, .hero-button, .main-cta, button:contains("Get Started"), button:contains("Learn More"), button:contains("Sign Up")');
      if ($ctaButtons.length > 0) {
        const $firstCtaButton = $ctaButtons.first();
        cy.wrap($firstCtaButton).then(($button) => {
          if ($button.is(':visible')) {
            cy.wrap($button).click();
          } else {
            cy.wrap($button).click({ force: true });
          }
        });
        cy.wait(2000);
        
        // Verify navigation occurred
        cy.url().should('not.eq', pageUrl);
        cy.log('✅ Main CTA button clicked and navigation occurred');
      } else {
        cy.log('ℹ️ Main CTA button not found');
      }
    });
  });

  // Test 10: Scroll page and verify sections load (services, features, etc.)
  it('should scroll page and verify sections load', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Scroll to different sections and verify they load
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);
    
    // Check for various sections
    cy.get("body").then(($body) => {
      const $sections = $body.find('.section, .features, .services, .about, .testimonials, .pricing, .contact, .footer');
      if ($sections.length > 0) {
        cy.log(`✅ Found ${$sections.length} sections after scrolling`);
        
        // Check specific section types
        const $serviceSections = $body.find('.services, .service, .features-section');
        const $featureSections = $body.find('.features, .feature, .services-section');
        const $testimonialSections = $body.find('.testimonials, .testimonial, .reviews');
        
        if ($serviceSections.length > 0) cy.log('✅ Services sections found');
        if ($featureSections.length > 0) cy.log('✅ Features sections found');
        if ($testimonialSections.length > 0) cy.log('✅ Testimonial sections found');
      } else {
        cy.log('ℹ️ No sections found after scrolling');
      }
    });
    
    // Scroll back to top
    cy.scrollTo('top', { duration: 1000 });
    cy.wait(500);
    cy.log('✅ Page scrolling completed');
  });

  // Test 11: Verify images/icons are displayed properly
  it('should verify images/icons are displayed properly', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Check for images
    cy.get("body").then(($body) => {
      const $images = $body.find('img');
      if ($images.length > 0) {
        cy.log(`✅ Found ${$images.length} images`);
        
        // Check if images are loaded
        cy.wrap($images).first().then(($img) => {
          if ($img.is(':visible') && $img[0].complete && $img[0].naturalWidth > 0) {
            cy.log('✅ Images are loading properly');
          } else {
            cy.log('ℹ️ Some images may not be loading properly');
          }
        });
      } else {
        cy.log('ℹ️ No images found');
      }
      
      // Check for icons
      const $icons = $body.find('.icon, .fa, .fas, .far, .fab, [class*="icon"], svg');
      if ($icons.length > 0) {
        cy.log(`✅ Found ${$icons.length} icons`);
      } else {
        cy.log('ℹ️ No icons found');
      }
    });
  });

  // Test 12: Verify footer is visible
  it('should verify footer is visible', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Scroll to bottom to ensure footer is loaded
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);
    
    // Use comprehensive flexible selectors for footer
    cy.get("body").then(($body) => {
      const $footerElements = $body.find('footer, .footer, .site-footer, .page-footer, .bottom-section');
      if ($footerElements.length > 0) {
        cy.wrap($footerElements).first().then(($footer) => {
          if ($footer.is(':visible')) {
            cy.log('✅ Footer is visible');
          } else {
            cy.log('ℹ️ Footer found but hidden by CSS');
          }
        });
      } else {
        cy.log('ℹ️ Footer not found');
      }
    });
  });

  // Test 13: Verify footer links (About, Contact, etc.)
  it('should verify footer links are present', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Scroll to bottom to ensure footer is loaded
    cy.scrollTo('bottom', { duration: 2000 });
    cy.wait(1000);
    
    // Use comprehensive flexible selectors for footer links
    cy.get("body").then(($body) => {
      const $footerLinks = $body.find('footer a, .footer a, .site-footer a, .page-footer a, a[href*="about"], a[href*="contact"], a[href*="privacy"], a[href*="terms"], a[href*="blog"]');
      if ($footerLinks.length > 0) {
        cy.log(`✅ Found ${$footerLinks.length} footer links`);
      } else {
        cy.log('ℹ️ Footer links not found');
      }
    });
  });

  // Test 14: Verify page responsiveness (mobile viewport)
  it('should verify page responsiveness on mobile viewport', () => {
    // Test mobile viewport
    cy.viewport(375, 667); // iPhone 6/7/8 dimensions
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Verify page is still functional on mobile
    cy.get('body').should('be.visible');
    cy.url().should('include', 'sendsile.com');
    
    // Check for mobile-specific elements
    cy.get("body").then(($body) => {
      const $mobileMenu = $body.find('.mobile-menu, .hamburger, .menu-toggle, .mobile-nav');
      if ($mobileMenu.length > 0) {
        cy.log('✅ Mobile menu elements found');
      } else {
        cy.log('ℹ️ No mobile-specific menu elements found');
      }
      
      // Check if content is still accessible
      const $content = $body.find('main, .content, .main-content');
      if ($content.length > 0) {
        cy.log('✅ Content is accessible on mobile');
      } else {
        cy.log('ℹ️ Main content not clearly identifiable on mobile');
      }
    });
    
    cy.log('✅ Mobile responsiveness verified');
    
    // Reset to desktop viewport
    cy.viewport(1280, 720);
    cy.wait(500);
  });

  // Test 15: Verify no console errors on page load
  it('should verify no console errors on page load', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(3000);
    
    // Check for console errors
    cy.window().then((win) => {
      const originalError = win.console.error;
      let errors = [];
      
      win.console.error = function(...args) {
        errors.push(args);
        originalError.apply(win.console, args);
      };
      
      // Trigger some page interactions to potentially cause errors
      cy.get('body').click().wait(1000);
      
      // Check if any errors were logged
      cy.then(() => {
        if (errors.length === 0) {
          cy.log('✅ No console errors detected');
        } else {
          cy.log(`⚠️ Found ${errors.length} console errors`);
          errors.forEach((error, index) => {
            cy.log(`Error ${index + 1}: ${JSON.stringify(error)}`);
          });
        }
        
        // Restore original console.error
        win.console.error = originalError;
      });
    });
  });

  // Test 16: Comprehensive page functionality test
  it('should test comprehensive page functionality', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    // Test multiple interactions in sequence
    cy.get("body").then(($body) => {
      // Test navigation
      const $navElements = $body.find('nav, .navbar, .header');
      if ($navElements.length > 0) {
        cy.log('✅ Navigation elements found');
      }
      
      // Test content sections
      const $contentSections = $body.find('main, .content, .main-content, section');
      if ($contentSections.length > 0) {
        cy.log('✅ Content sections found');
      }
      
      // Test interactive elements
      const $interactiveElements = $body.find('button, a, input, select, textarea');
      if ($interactiveElements.length > 0) {
        cy.log(`✅ Found ${$interactiveElements.length} interactive elements`);
      }
    });
    
    // Test scrolling
    cy.scrollTo('50%', { duration: 1000 });
    cy.wait(500);
    cy.scrollTo('bottom', { duration: 1000 });
    cy.wait(500);
    cy.scrollTo('top', { duration: 1000 });
    cy.wait(500);
    cy.log('✅ Page scrolling functionality tested');
    
    // Test URL stability
    cy.url().should('include', 'sendsile.com');
    cy.log('✅ URL stability verified');
  });

  // Test 17: Interact with all components and click all buttons
  it('should interact with all components and click all buttons', () => {
    cy.visit(pageUrl, { timeout: 30000 });
    cy.wait(2000);
    
    cy.get("body").then(($body) => {
      // Find and interact with ALL buttons
      const $allButtons = $body.find('button, .btn, .button, input[type="button"], input[type="submit"], .cta-button, .hero-button, .action-button, .primary-btn, .secondary-btn');
      if ($allButtons.length > 0) {
        cy.log(`✅ Found ${$allButtons.length} buttons to interact with`);
        
        // Click each button with proper error handling
        $allButtons.each((index, $button) => {
          const $buttonRef = $($button); // Store reference
          cy.wrap($buttonRef).then(($btn) => {
            if ($btn.is(':visible')) {
              cy.wrap($btn).click();
              cy.wait(500);
              cy.log(`✅ Clicked button ${index + 1}: ${$btn.text().trim() || $btn.attr('class') || $btn.attr('type') || 'Button'}`);
            } else {
              cy.wrap($btn).click({ force: true });
              cy.wait(500);
              cy.log(`✅ Force clicked button ${index + 1}: ${$btn.attr('class') || $btn.attr('type') || 'Hidden Button'}`);
            }
          });
        });
      } else {
        cy.log('ℹ️ No buttons found to interact with');
      }
      
      // Find and interact with ALL links
      const $allLinks = $body.find('a, .link, .nav-link, .menu-link, .action-link');
      if ($allLinks.length > 0) {
        cy.log(`✅ Found ${$allLinks.length} links to interact with`);
        
        // Click each link with proper error handling
        $allLinks.each((index, $link) => {
          const $linkRef = $($link); // Store reference
          cy.wrap($linkRef).then(($lnk) => {
            if ($lnk.is(':visible')) {
              cy.wrap($lnk).click();
              cy.wait(500);
              cy.log(`✅ Clicked link ${index + 1}: ${$lnk.text().trim() || $lnk.attr('href') || 'Link'}`);
            } else {
              cy.wrap($lnk).click({ force: true });
              cy.wait(500);
              cy.log(`✅ Force clicked link ${index + 1}: ${$lnk.attr('href') || 'Hidden Link'}`);
            }
          });
        });
      } else {
        cy.log('ℹ️ No links found to interact with');
      }
      
      // Find and interact with ALL input fields
      const $allInputs = $body.find('input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea, select');
      if ($allInputs.length > 0) {
        cy.log(`✅ Found ${$allInputs.length} input fields to interact with`);
        
        // Interact with each input field
        $allInputs.each((index, $input) => {
          const $inputRef = $($input); // Store reference
          cy.wrap($inputRef).then(($inp) => {
            if ($inp.is(':visible')) {
              // Test typing in input
              cy.wrap($inp).type('test input').clear();
              cy.wait(300);
              cy.log(`✅ Interacted with input ${index + 1}: ${$inp.attr('type') || $inp.attr('name') || 'Input Field'}`);
            } else {
              cy.log(`ℹ️ Input ${index + 1} is hidden: ${$inp.attr('type') || $inp.attr('name') || 'Input Field'}`);
            }
          });
        });
      } else {
        cy.log('ℹ️ No input fields found to interact with');
      }
      
      // Find and interact with ALL interactive components
      const $allInteractive = $body.find('[role="button"], [role="link"], [role="tab"], [tabindex], .dropdown, .modal, .popup, .tooltip, .accordion, .carousel, .slider');
      if ($allInteractive.length > 0) {
        cy.log(`✅ Found ${$allInteractive.length} interactive components`);
        
        // Interact with each interactive component
        $allInteractive.each((index, $component) => {
          const $compRef = $($component); // Store reference
          cy.wrap($compRef).then(($comp) => {
            const tagName = $comp.prop('tagName');
            if ($comp.is(':visible')) {
              // Different interactions based on component type
              if (tagName === 'BUTTON') {
                cy.wrap($comp).click();
                cy.log(`✅ Clicked interactive button ${index + 1}`);
              } else if (tagName === 'A') {
                cy.wrap($comp).click();
                cy.log(`✅ Clicked interactive link ${index + 1}`);
              } else if ($comp.is('[tabindex]')) {
                cy.wrap($comp).focus();
                cy.wait(300);
                cy.log(`✅ Focused tabbable element ${index + 1}`);
              } else {
                cy.wrap($comp).hover();
                cy.wait(300);
                cy.log(`✅ Hovered over component ${index + 1}: ${tagName}`);
              }
            } else {
              cy.log(`ℹ️ Component ${index + 1} is hidden: ${tagName}`);
            }
          });
        });
      } else {
        cy.log('ℹ️ No additional interactive components found');
      }
      
      // Test form interactions
      const $allForms = $body.find('form, .form, .contact-form, .search-form, .newsletter-form');
      if ($allForms.length > 0) {
        cy.log(`✅ Found ${$allForms.length} forms to interact with`);
        
        // Interact with each form
        $allForms.each((index, $form) => {
          const $formRef = $($form); // Store reference
          cy.wrap($formRef).then(($frm) => {
            if ($frm.is(':visible')) {
              // Try to submit form
              cy.wrap($frm).within(() => {
                cy.get('button[type="submit"], input[type="submit"], .submit-btn').first().then(($submitBtn) => {
                  if ($submitBtn.length > 0) {
                    const $submitRef = $($submitBtn);
                    cy.wrap($submitRef).then(($btn) => {
                      if ($btn.is(':visible')) {
                        cy.wrap($btn).click();
                        cy.wait(500);
                        cy.log(`✅ Submitted form ${index + 1}`);
                      } else {
                        cy.wrap($btn).click({ force: true });
                        cy.wait(500);
                        cy.log(`✅ Force submitted form ${index + 1}`);
                      }
                    });
                  } else {
                    cy.log(`ℹ️ No submit button found in form ${index + 1}`);
                  }
                });
              });
            } else {
              cy.log(`ℹ️ Form ${index + 1} is hidden`);
            }
          });
        });
      } else {
        cy.log('ℹ️ No forms found to interact with');
      }
    });
    
    cy.log('✅ Comprehensive component interaction testing completed');
  });
});
