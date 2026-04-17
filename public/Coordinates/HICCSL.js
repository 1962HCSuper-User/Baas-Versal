window.dynamicCoordinates = {
  coordinates: {
    0: {
      "Full_Name": { coords: [{ pos: [101.28, 573.75], char_spacing: 0, font_size: 12 }] },
      "Father/Husband name": { coords: [{ pos: [131.40, 559.79], char_spacing: 0, font_size: 12 }] },
      "Address": { coords: [
          { pos: [107.16, 543.83], char_spacing: 0, font_size: 12 },
          { pos: [94.67, 530.40], char_spacing: 0, font_size: 12 }
        ] 
      },
      "Membership no": { coords: [{ pos: [122.68, 39.70], char_spacing: 0, font_size: 15 }] },
      "Date of birth": { coords: [{ pos: [229.78, 516.91], char_spacing: 10, font_size: 12 }] },
      "AGE": { coords: [{ pos: [345.91, 517.38], char_spacing: 0, font_size: 12 }] },
      "Sex": { coords: [{ pos: [469.33, 520.85], char_spacing: 0, font_size: 12 }] },
      "Aadhar card": { coords: [{ pos: [66.02, 498.07], char_spacing: 14, font_size: 12 }] },
      "Pan card": { coords: [{ pos: [302.57, 501.75], char_spacing: 14, font_size: 12 }] },
      "Nominee name": { coords: [{ pos: [137.28, 485.79], char_spacing: 0, font_size: 12 }] },
      "Nominee relation": { coords: [{ pos: [122.59, 471.09], char_spacing: 0, font_size: 12 }] },
      "Nominee age": { coords: [{ pos: [489.16, 476.24], char_spacing: 0, font_size: 12 }] },
      "Member type": {
        coords: [{ pos: [40.84, 300.44], char_spacing: 0, font_size: 10 }],
        checkmarks: {
          "Nominal": { coords: [{ pos: [158, 240], char_spacing: 0, font_size: 20 }] },
          "Regular": { coords: [{ pos: [268, 242], char_spacing: 0, font_size: 20 }] }
        }
      },
      "Occupation": {
        coords: [{ pos: [71.90, 515.71], char_spacing: 0, font_size: 12 }],
        checkmarks: {
          "Business": { coords: [{ pos: [179.89, 156.93], char_spacing: 0, font_size: 14 }] },
          "farmer": { coords: [{ pos: [448.03, 140.03], char_spacing: 0, font_size: 14 }] },
          "Service": { coords: [{ pos: [111.57, 156.93], char_spacing: 21, font_size: 16 }] },
          "Housewife": { coords: [{ pos: [182.83, 137.83], char_spacing: 21, font_size: 16 }] }
        }
      },
      "Education": {
        coords: [{ pos: [40.84, 300.44], char_spacing: 0, font_size: 10 }],
        checkmarks: {
          "SSC": { coords: [{ pos: [180.62, 180.44], char_spacing: 21, font_size: 16 }] },
          "PG": { coords: [{ pos: [342.24, 178.24], char_spacing: 21, font_size: 16 }] },
          "UG": { coords: [{ pos: [260.70, 178.97], char_spacing: 21, font_size: 16 }] },
          "Professional": { coords: [{ pos: [458.31, 178.97], char_spacing: 21, font_size: 16 }] }
        }
      },
      "Manager name": { coords: [{ pos: [77.14, 393.05], char_spacing: 0, font_size: 12 }] },
      "Manager father name": { coords: [{ pos: [132.14, 379.05], char_spacing: 0, font_size: 12 }] },
      "Manager address": { coords: [{ pos: [57.94, 364.36], char_spacing: 0, font_size: 12 }] },
      "Proof document": { coords: [{ pos: [27.82, 296.97], char_spacing: 0, font_size: 12 }] },
      "Proof document 2": { coords: [{ pos: [302.57, 299.18], char_spacing: 0, font_size: 12 }] },
      "Mobile no": { coords: [{ pos: [217.35, 263.18], char_spacing: 0, font_size: 12 }] },
      "Email": { coords: [{ pos: [358.40, 263.91], char_spacing: 0, font_size: 12 }] },
      "Religion": { coords: [{ pos: [61.61, 224.03], char_spacing: 0, font_size: 12 }] },
      "State": { coords: [{ pos: [266.57, 225.50], char_spacing: 0, font_size: 12 }] },
      "Country": { coords: [{ pos: [453.17, 227.71], char_spacing: 0, font_size: 12 }] },
      "Relation status": { coords: [{ pos: [232.78, 205.67], char_spacing: 0, font_size: 12 }] }
    }
  },

  field_mapping: {
    "Full_Name": "fullName",
    "Father/Husband name": "guardianName",
    "Address": "address",
    "Membership no": "membershipNo",
    "Date of birth": "dateOfBirth",
    "AGE": "age",
    "Sex": "sex",
    "Aadhar card": "aadharCard",
    "Pan card": "panCard",
    "Nominee name": "nomineeName",
    "Nominee relation": "nomineeRelation",
    "Nominee age": "nomineeAge",
    "Member type": "memberType",
    "Occupation": "occupation",
    "Education": "education",
    "Manager name": "managerName",
    "Manager father name": "managerGuardianName",
    "Manager address": "managerAddress",
    "Proof document": "proofDocument",
    "Proof document 2": "proofDocument2",
    "Mobile no": "mobileNo",
    "Email": "email",
    "Religion": "religion",
    "State": "state",
    "Country": "country",
    "Relation status": "relationStatus"
  },

  charSpacedFields: [
    "Date of birth",
    "Aadhar card",
    "Pan card",
    "Service",
    "Housewife",
    "SSC",
    "PG",
    "UG",
    "Professional"
  ],

  photo_signature: {
    photo: {
      0: { x: 301.62, y: 344.89, width: 75, height: 100 }
    },
    signature: {
      0: [
        { x: 231, y: 304.89, width: 110, height: 110 },
        { x: 424.36, y: 67.43, width: 110, height: 110 },
        { x: 439.36, y: 374.89, width: 110, height: 110 }
      ]
    },
    stamps: {
      0: [
        { file: "Sarayan2.png", x: 349, y: 384, width: 100, height: 100 },
        { file: "Sarayan2.png", x: 260, y: 45, width: 100, height: 100 },
        { file: "Msin.png", x: 68.96, y: 105, width: 75, height: 75 },
        { file: "Msing.png", x: 68.96, y: 70, width: 90, height: 90 },
        { file: "Msin.png", x: 502, y: 44, width: 90, height: 90 },
        { file: "Msing.png", x: 492, y: 9, width: 90, height: 90 }
      ]
    }
  }
};
