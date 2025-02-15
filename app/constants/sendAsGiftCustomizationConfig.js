export const PRODUCT_SELECTION_TYPE = {
  ANY_PRODUCT: 1,
  SPECIFIC_PRODUCT: 2,
};
export const GIFT_CUSTOMIZATION_STATE = {
  selectionType: PRODUCT_SELECTION_TYPE.ANY_PRODUCT,
  selectedProductList: [],

  enableGiftWrap: true,
  giftWrapImage: null,
  giftWrapTitle: "Gift",
  giftWrapPrice: "0",
  giftWrapDescription: "Description",

  enableGiftMessage: false,
  giftMessageTitle: "Title",
  giftMessageDescription: "Description",

  enableGiftReceipt: true,
  sendWithGiftReceipt: false,
  sendWithNoInvoice: false,

  enableGiftRecipientEmail: true,
  recipientEmailTitle: "Title",
  recipientEmailDescription: "Description",
  recipientEmail: "",
  sendEmailUponCheckout: false,
  sendEmailWhenItemIsShipped: false,

  giftWrapCustomizationText: "Gift 1",
  giftWrapCustomizationColor: "#000000",
  giftWrapCustomizationEmoji: "🔥",

  giftMessageCustomizationText: "Gift 2",
  giftMessageCustomizationColor: "#000000",
  giftMessageCustomizationEmoji: "🔥",

  giftReceiptCustomizationText: "Gift 2",
  giftReceiptCustomizationColor: "#000000",
  giftReceiptCustomizationEmoji: "🔥",

  giftReceiptEmailCustomizationText: "Gift 2",
  giftReceiptEmailCustomizationColor: "#000000",
  giftReceiptEmailCustomizationEmoji: "🔥",
};
export const GIFT_CUSTOMIZATION_ERROR_STATE = {
  noProductError: false,
};
