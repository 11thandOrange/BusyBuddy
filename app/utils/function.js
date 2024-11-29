import db from "../db.server";
import {
  authenticate,
  STARTER_MONTHLY_PLAN,
  PRO_MONTHLY_PLAN,
  ENTERPRISE_MONTHLY_PLAN,
} from "../shopify.server";
import { fetchTimeObject } from "./clientFunctions";
import { getCardCountdownTimer, getClassicCountdownTimer, getDividerCountdownTimer, getHexagonCountdownTimer, getModernCountdownTimer, getProgressBarCountdownTimer, getProgressCircleCountdownTimer } from "./countdown_timer/countdown_timer";

export const getShopName = async (request) => {
  let parsedUrl;
  if (request.method == "GET") {
    parsedUrl = new URL(request.url);
  } else {
    parsedUrl = new URL(request.headers.get("referer"));
  }
  const shop = parsedUrl.searchParams.get("shop");
  if (shop) {
    return shop;
  }
  return "";
};
export const getCategories = async () => {
  try {
    const categories = await db.Category.findMany({
      select: {
        id: true,
        content: true,
      },
    });
    return categories;
  } catch (error) {
    return [];
  }
};
export const check_app_active = async (appId, shop) => {
  try {
    const setting = await db.merchant.findFirst({
      where: {
        appId: appId,
        shop: shop,
        enabled: true,
      },
    });
    return setting !== null;
  } catch (error) {
    return false;
  }
};

export const check_subscription = async () => {
  const { billing, session } = await authenticate.admin(request);
  const billingCheck = await billing.check({
    plans: [STARTER_MONTHLY_PLAN, PRO_MONTHLY_PLAN, ENTERPRISE_MONTHLY_PLAN],
  });
  if (
    !billingCheck.appSubscriptions ||
    billingCheck.appSubscriptions.length === 0
  ) {
    return {
      hasSubscription: false,
    };
  }
  const subscription = billingCheck.appSubscriptions[0];
  console.log("Subscription found:", subscription);

  return {
    hasSubscription: true,
    subscription,
  };
};

export const markWidgetAsFavorite = async (shop, widgetId) => {
  try {
    const existingFavorite = await db.fav_widget.findUnique({
      where: {
        widgetId_shop: {
          shop: shop,
          widgetId: widgetId,
        },
      },
    });

    if (existingFavorite) {
      await db.fav_widget.delete({
        where: {
          widgetId_shop: {
            shop: shop,
            widgetId: widgetId,
          },
        },
      });
      return false;
    }

    const favorite = await db.fav_widget.create({
      data: {
        shop: shop,
        widgetId: widgetId,
      },
    });

    return favorite;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const createEvent = async (data) => {
  await db.analytics.create({
    data: {
      eventId: data.eventId,
    },
  });
};
export function getTimeDifference(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const differenceInMilliseconds = end - start;

  const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor(
    (differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60),
  );
  const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}
export const getEventTypes = async (appId) => {
  const eventTypes = await db.app.findFirst({
    where: {
      id: appId,
    },
    include: {
      activities: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!eventTypes) return [];
  const activityIds = eventTypes.activities.map((activity) => activity.id);
  return activityIds;
};

export const getAnnouncementBar = async (shop) => {
  let script = '';

  const announcement_bar = await prisma.announcement_bar.findFirst({
    where: {
      shop: shop,
      status: true
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (announcement_bar && announcement_bar.status) {
    announcement_bar.general_setting = JSON.parse(announcement_bar.general_setting);
    announcement_bar.theme_setting = JSON.parse(announcement_bar.theme_setting);
    announcement_bar.theme_style = JSON.parse(announcement_bar.theme_style);

    script = `
     
      const announcementBar = document.createElement('div');
      announcementBar.classList.add('busy-buddy-announcement-bar');
      announcementBar.id = 'busyBuddyAnnouncementBar'; 
      announcementBar.style.padding = '10px';
      announcementBar.style.textAlign = 'center';
      announcementBar.style.fontWeight = 'bold';
      announcementBar.style.height = '45px';
      announcementBar.style.width = '100%';
      announcementBar.style.position = 'relative'; /* Ensure space for the close button */
    `;
    
    if(await check_enable_button(shop))
    {
        script += `
        const closeButton = document.createElement('button');
        closeButton.textContent = 'x';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'transparent';
        closeButton.style.fontSize = '18px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'inherit';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', function() {
          announcementBar.style.display = 'none';
        });
        announcementBar.appendChild(closeButton);
      `;
    }
    
    script += `
      const messageDiv = document.createElement('div');
      announcementBar.appendChild(messageDiv);
    `;
  
    if (announcement_bar.type == 1) {
      script += `
        messageDiv.textContent = "${announcement_bar.general_setting.message.replace(/"/g, '\\"')}";
      `;
    }

    if (announcement_bar.type == 2) { 
      const currentTime = new Date().getTime();
      const endTime = new Date(announcement_bar.general_setting.countDownEndsAt).getTime();

      script += `
        let countdownInterval;

        function updateCountdown() {
          const now = new Date().getTime();
          let difference = getTimeDifference(now, ${endTime});
          
          let countdownString = \`<span>\${difference.days}d \${difference.hours}h \${difference.minutes}m \${difference.seconds}s </span>\`;
          let message = ("${announcement_bar.general_setting.message}").replace('#countdown_timer#', countdownString);

          // Update only the message, not the close button
          messageDiv.innerHTML = message;

          if (difference.difference <= 0) {
            clearInterval(countdownInterval);
            announcementBar.innerHTML = "";
          }
        }
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);  // Start the countdown interval after its declaration
      `;
    }
    if(announcement_bar.type == 3)
      {
        const shipping_rule = await getShippingRule(shop);
        const getDomestingShipping = shipping_rule.find((shipping)=>shipping.name=='Domestic');
        const price = getDomestingShipping.price_based_shipping_rates;
        const free_price = price.find((pr)=> pr.price == 0);
        if(free_price.min_order_subtotal == null) return {script:''}
        
          script +=  `let shipping_price = ${free_price.min_order_subtotal}
                      get_cart_total(function(price){
                        if(price == 0)
                        {
                          messageDiv.textContent = "${announcement_bar.general_setting.initialMessage.replace('#amount#', free_price.min_order_subtotal)}";
                        }
                        else if(price!=0 && price < shipping_price)
                        {
                          let difference = price - shipping_price
                          let message_content = "${announcement_bar.general_setting.progressMessage}"
                          messageDiv.textContent = message_content.replace('#amount#', difference);
                        }
                        else
                        {
                          messageDiv.textContent = "${announcement_bar.general_setting.message}";
                        }
        })
          `;
        
      }
    if(announcement_bar.type == 4)
    {
      const order_count = await getOrderCounter(shop);
      script += `
      messageDiv.textContent = "${announcement_bar.general_setting.message.replace('#orders_count#', order_count)}";`;
    }
    if (announcement_bar.theme_style?.id == 1) {
      script += `announcementBar.style.backgroundColor = "${announcement_bar.theme_setting?.backgroundColor}";
                  announcementBar.style.color = "${announcement_bar.theme_setting?.textColor}";`
              
    }
    if (announcement_bar.theme_style?.id != 1) {
       script += `announcementBar.style.color = "#fff";`
    }
    if (announcement_bar.theme_style?.id == 2) {
      script += `announcementBar.classList.add('busy-buddy-announcement-bar-2');`
    }

    if (announcement_bar.theme_style?.id == 3) {
      script += `announcementBar.classList.add('busy-buddy-announcement-bar-3');`
    }
    if (announcement_bar.theme_style?.id == 4) {
      script += `announcementBar.classList.add('busy-buddy-announcement-bar-4');`
    }
    if (announcement_bar.theme_style?.id == 5) {
      script += `announcementBar.classList.add('busy-buddy-announcement-bar-5');`
    }
    if (announcement_bar.theme_style?.id == 6) {
      script += `announcementBar.classList.add('busy-buddy-announcement-bar-6');`
    }
    if (announcement_bar.theme_style?.id == 7) {
      script += `announcementBar.classList.add('busy-buddy-announcement-bar-7');`
    }
    if (announcement_bar.theme_style?.id == 8) {
      script += `announcementBar.classList.add('busy-buddy-announcement-bar-8');`
    }

    if (announcement_bar.theme_setting?.status == 'TOP_FIXED') {
      script += `
        announcementBar.style.position = 'sticky';
        announcementBar.style.top = '0'; 
        announcementBar.style.left = '0'; 
        announcementBar.style.zIndex = '9999';
      `;
    }

    if (announcement_bar.theme_setting?.status == 'BOTTOM') {
      script += ` document.body.appendChild(announcementBar);`;
    } else {
      script += `document.body.prepend(announcementBar);`;
    }
  }

  return { script };
};

export const getInactiveTabMessage = async (shop) => {
  let message = await db.Inactive_tab_message.findFirst({
    where: {
      shop: shop,
    },
    select: {
      message: true,
    },
  });
  message = message ? message.message : "";
  const script = `
    (function() {
      var originalTitle = document.title;
      function handleVisibilityChange() {
        if (document.hidden) {
          document.title = "${message}";
        } 
          else {
          document.title = originalTitle;
        }
      }
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      if (document.hidden) {
        document.title = "${message}";
      }
    })();
  `;
  return { script };
};
export const getCartNotice = async (shop) => {
  let cartNotice = await db.Cart_notice.findFirst({
    where: {
      shop: shop,
    },
  });

  let htmlToInsert = `<div class="buddyBossCartNotice">`;

  if (cartNotice.primary_message) {
    htmlToInsert += `<div class="primary-message">${cartNotice.primary_message}</div>`;
  }

  if (cartNotice.secondary_message) {
    htmlToInsert += `<div class="secondary-message">${cartNotice.secondary_message}</div>`;
  }

  if (cartNotice.show_countdown && cartNotice.countdown_timer) {
    htmlToInsert += `
      <div class="countdown-timer">
        <span id="countdown">${cartNotice.countdown_timer}</span> seconds remaining!
      </div>
      <script>
        (function() {
          let countdown = ${cartNotice.countdown_timer};
          const countdownElement = document.getElementById('countdown');
          const countdownInterval = setInterval(function() {
            countdown--;
            countdownElement.textContent = countdown + ' seconds remaining!';
            if (countdown <= 0) {
              clearInterval(countdownInterval);
              countdownElement.textContent = 'Time is up!';
            }
          }, 1000);
        })();
      </script>
    `;
  }

  if (cartNotice.fire_icon) {
    htmlToInsert += `
      <div class="fire-icon">
        <i class="fas fa-fire"></i> Hot Deal!
      </div>
    `;
  }

  htmlToInsert += `</div>`;

  const script = `
  (function() {
    const forms = document.querySelectorAll('form[action="/cart"]');
    forms.forEach(function(form) {
      form.insertAdjacentHTML('beforebegin', \`${htmlToInsert}\`);
    });
  })();
`;
  return { script };
};

export const getCountdownTimer = async (shop) => {
  let countdownTimerHtml = '';  // Initialize it as an empty string
  let script;

  // Fetch the countdown timer settings from the database
  let countdownTimer = await db.countdown_timer.findFirst({
    where: {
      shop: shop,
    },
    select: {
      general_setting: true,
      display_setting: true,
      position: true,
    },
  });

  // Check if countdown timer exists
  if (countdownTimer) {
    countdownTimer.general_setting = JSON.parse(countdownTimer.general_setting);
    countdownTimer.display_setting = JSON.parse(countdownTimer.display_setting);
    
    if (countdownTimer.general_setting.countdown_timer_end_date === 1) {
      const timeLeft = fetchTimeObject(new Date().getTime(), countdownTimer.general_setting.countdown_end);
      countdownTimerHtml += `
        <div style="margin-top:${countdownTimer.display_setting.marginTop}${countdownTimer.display_setting.marginTopUnit}; margin-bottom:${countdownTimer.display_setting.marginBottom}${countdownTimer.display_setting.marginBottomUnit};"
          class="busyBuddyCountdownTimer preview-card-container timer ${countdownTimer.display_setting.timerAlignment} ${
          countdownTimer.display_setting.theme !== 1 ? "align-column" : "align-row"}">
          <div class="main-countdown-title" style="color:${countdownTimer.display_setting.titleColor};">
            ${countdownTimer.display_setting.title}
          </div>
      `;

      switch (countdownTimer.display_setting.theme) {
        case 1:
          countdownTimerHtml += getClassicCountdownTimer(timeLeft, countdownTimer);
          break;
        case 2:
          countdownTimerHtml += getHexagonCountdownTimer(timeLeft, countdownTimer);
          break;
        case 3:
          countdownTimerHtml += getProgressCircleCountdownTimer(timeLeft, countdownTimer);
          break;
        case 4:
          countdownTimerHtml += getCardCountdownTimer(timeLeft, countdownTimer);
          break;
        case 5:
          countdownTimerHtml += getModernCountdownTimer(timeLeft, countdownTimer);
          break;
        case 6:
          countdownTimerHtml += getProgressBarCountdownTimer(timeLeft, countdownTimer);
          break;
        case 7:
          countdownTimerHtml += getDividerCountdownTimer(timeLeft, countdownTimer);
          break;
        default:
          break;
      }

      countdownTimerHtml += '</div>';
    
      script = `
        let countdownTimerInterval;
        function updateCountdownNew() {
          const now = new Date().getTime();
          const endTime = ${new Date(countdownTimer.general_setting.countdown_end).getTime()};
          const difference = getTimeDifference(now, endTime);
          document.getElementById('seconds').textContent = difference.seconds;
          document.getElementById('minutes').textContent = difference.minutes;
          document.getElementById('hours').textContent = difference.hours;
          document.getElementById('days').textContent = difference.days;
          if (difference.difference <= 0) {
            clearInterval(countdownTimerInterval);
          }
        }
        
        (function() {
          const form = document.querySelector('.product__info-wrapper');
          if (form) {
            const htmlToInsert = \`<div class="busyBuddyCountdownTimer">${countdownTimerHtml}</div>\`;
            form.insertAdjacentHTML('afterend', htmlToInsert);
            countdownTimerInterval = setInterval(updateCountdownNew, 1000);
          }
        })();
      `;
    }
  }

  return { script, discount_products:countdownTimer?.display_setting?.show_on_discount_products };
};

export const check_enable_button = async (shop) => {
  try {
    const setting = await db.announcement_bar_setting.findFirst({
      where: {
        shop: shop,
        enable_close_button: true,
      },
    });
    return setting !== null;
  } 
  catch (error) {
    return false;
  }
};

export const can_active = async (shop) => {
  try {
    const setting = await db.merchant.findMany({
      where: {
        shop: shop,
        enabled: true,
      },
      _count: {
        id: true
      }
    });
    let hasSubscription = check_subscription();
    if(!((await hasSubscription).hasSubscription))
    {
      return setting.count <= 1;
    }
    else
    {
      return setting.count <= 4 && (await hasSubscription).hasSubscription()?true:false;;
    }
  } 
  catch (error) 
  {
    return false;
  }
};
export const storefront_api = async (shop, url, method, query=null) => {
  const session = await db.session.findFirst({
    where: { shop: shop }
  });
  
  if (session) {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'X-Shopify-Access-Token': session.accessToken,
          'Content-Type': 'application/json',
        },
        body: query
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: error.message };
    }
  } else {
    return { success: false, error: 'Session not found' };
  }
}
export const getShippingRule = async(shop)=>{
  const shipping_rule = await storefront_api(shop, `https://${shop}/admin/api/2024-04/shipping_zones.json`, 'GET');
  return shipping_rule.data.shipping_zones;
}
export const getOrderCounter = async(shop)=>{
  const order_count = await storefront_api(shop, `https://${shop}/admin/api/2024-10/orders/count.json?fulfillment_status=shipped`, 'GET');
  if(order_count.success)
  {
    return order_count.data.count;
  }
  return 0;
}

export const addScriptTag = async(shop)=>{
  const scriptTag = await storefront_api(shop, `https://${shop}/admin/api/2024-10/script_tags.json`, 'GET', JSON.stringify({
    script_tag: {
      event: 'onload',
      src: `${process.env.SHOPIFY_APP_URL}/scripts/script.js`,
    },
  }));
}