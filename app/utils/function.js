import db from "../db.server";

export const getShopName = async(request) => {
  let parsedUrl;
  if(request.method=='GET')
  {
    parsedUrl = new URL(request.url);
  }
  else
  {
    parsedUrl = new URL(request.headers.get('referer'));
  }
  const shop = parsedUrl.searchParams.get("shop");
  if (shop) {
    return shop;
  }
  return '';
}
export const getCategories = async() =>{
  try{
    const categories = await db.Category.findMany({
      select: {
        id: true,
        content: true,
      },
    });
    return categories;
  }catch(error)
  {
    return [];
  }
}
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
      console.error('Error checking setting:', error);
      return false;
    }
  };

export const check_subscription = async (billing, plans) =>
{
  const { hasActivePayment, appSubscriptions } = await billing.check({
    plans: plans,
    isTest: false,
  });
 console.log(hasActivePayment)
 console.log(appSubscriptions)
}

export const markWidgetAsFavorite = async(shop, widgetId) => {
  try {
    const existingFavorite = await db.fav_widget.findUnique({
      where: {
        widgetId_shop:{
          shop: shop,
          widgetId: widgetId,
        }
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

    // Create a new favorite record
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
}
