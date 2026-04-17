window.dynamicCoordinates = {
  coordinates: {
    0: {
      "Membership no": { coords: [{ pos: [23.50, 501.10], char_spacing: 18, font_size: 15 }] },
      "Account opening date": {
        coords: [
          { pos: [23.50, 471.70], char_spacing: 18, font_size: 15 },
          { pos: [181.10, 30.30], char_spacing: 2, font_size: 8 }
        ]
      },
      "Date of birth": { coords: [{ pos: [65.50, 382.90], char_spacing: 18, font_size: 15 }] },
      "Account no": { coords: [{ pos: [180.70, 473.50], char_spacing: 18, font_size: 15 }] },
      "Full_Name": { coords: [{ pos: [66.50, 413.50], char_spacing: 18, font_size: 15 }] },
      "AGE": { coords: [{ pos: [232.90, 383.50], char_spacing: 18, font_size: 15 }] },
      "Father/Husband name": { coords: [{ pos: [83.70, 360.10], char_spacing: 18, font_size: 15 }] },
      "Receipt no": { coords: [{ pos: [23.50, 443.50], char_spacing: 18, font_size: 15 }] },
      "Certificate no": { coords: [{ pos: [242.50, 444.70], char_spacing: 18, font_size: 15 }] },
      "House no": { coords: [{ pos: [57.70, 337.30], char_spacing: 18, font_size: 15 }] },
      "Street/Village": { coords: [{ pos: [207.70, 337.90], char_spacing: 18, font_size: 15 }] },
      "Post": { coords: [{ pos: [40.30, 315.70], char_spacing: 18, font_size: 15 }] },
      "District": { coords: [{ pos: [206.50, 317.50], char_spacing: 18, font_size: 15 }] },
      "State": { coords: [{ pos: [43.90, 295.30], char_spacing: 18, font_size: 15 }] },
      "Pincode": { coords: [{ pos: [351.10, 297.10], char_spacing: 18, font_size: 15 }] },
      "Mobile no": { coords: [{ pos: [97.90, 274.30], char_spacing: 18, font_size: 15 }] },
      "Nominee name": { coords: [{ pos: [64.30, 180.70], char_spacing: 18, font_size: 15 }] },
      "Nominee relation": { coords: [{ pos: [51.70, 157.90], char_spacing: 18, font_size: 15 }] },
      "Nominee age": { coords: [{ pos: [216.10, 159.70], char_spacing: 18, font_size: 15 }] },
      "Proportion": { coords: [{ pos: [290, 159.70], char_spacing: 18, font_size: 15 }] },
      "Pan card": { coords: [{ pos: [279.70, 80.50], char_spacing: 18, font_size: 15 }] },
      "Amount": { coords: [{ pos: [64.90, 48.70], char_spacing: 18, font_size: 15 }] },
      "Amount in word": { coords: [{ pos: [236.50, 48.90], char_spacing: 3, font_size: 13 }] },
      "Cash\\cheque": { coords: [{ pos: [103.90, 29.10], char_spacing: 2, font_size: 13 }] },
      "Application no": { coords: [{ pos: [320.50, 528.10], char_spacing: 2, font_size: 15 }] },
      "Denomination": { coords: [{ pos: [330.50, 505.10], char_spacing: 18, font_size: 15 }] }
    }
  },

  field_mapping: {
    "Account no": "accountNo",
    "Membership no": "membershipNo",
    "Full_Name": "fullName",
    "Account opening date": "accountOpeningDate",
    "Date of birth": "dateOfBirth",
    "AGE": "age",
    "Father/Husband name": "guardianName",
    "Receipt no": "receiptNo",
    "Certificate no": "certificateNo",
    "House no": "houseNo",
    "Street/Village": "street",
    "Post": "post",
    "District": "district",
    "State": "state",
    "Pincode": "pincode",
    "Mobile no": "mobileNo",
    "Nominee name": "nomineeName",
    "Nominee relation": "nomineeRelation",
    "Nominee age": "nomineeAge",
    "Proportion": "proportion",
    "Pan card": "panCard",
    "Amount": "amount",
    "Amount in word": "amountInWords",
    "Cash\\cheque": "paymentMode",
    "Application no": "applicationNo",
    "Denomination": "denomination"
  },

  charSpacedFields: [
    "Account no",
    "Membership no",
    "Full_Name",
    "Account opening date",
    "Date of birth",
    "AGE",
    "Father/Husband name",
    "Receipt no",
    "Certificate no",
    "House no",
    "Street/Village",
    "Post",
    "District",
    "State",
    "Pincode",
    "Mobile no",
    "Nominee name",
    "Nominee relation",
    "Nominee age",
    "Proportion",
    "Pan card",
    "Amount",
    "Denomination"
  ],

photo_signature: {
    photo: {
      0: { x: 380, y: 545, width: 75, height: 100 }
    },
    signature: {
      0: [
        { x: 300.90, y: 550.70, width: 184.275, height: 34.02 },
        { x: 270.50, y: 265, width: 184.275, height: 34.02 }
      ],
      1: [
        { x: 355.17, y: 305, width: 184.275, height: 34.02 }
      ]
    },
    stamps: {
      0: [
        { file: "Sahara.png", x: 300, y: 550, width: 100, height: 100 },
        { file: "Sahara.png", x: 190, y: 70, width: 100, height: 100 },
        { file: "Msin.png", x: 358, y: 190, width: 90, height: 90 },
        { file: "Msing.png", x: 365, y: 150, width: 100, height: 100 }
      ],
      1: [
        { file: "Sahara.png", x: 280, y: 300, width: 100, height: 100 },
        { file: "Msing.png", x: 390, y: 2, width: 90, height: 90 },
        { file: "Msin.png", x: 380, y: 35, width: 90, height: 90 },
        { file: "Msin.png", x: 408, y: 180, width: 90, height: 90 },
        { file: "Msing.png", x: 405, y: 150, width: 90, height: 90 }
      ]
    }
  }
};
