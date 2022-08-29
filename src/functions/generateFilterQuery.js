/****************************************************
 * ENCRYPTION / DECRYPTION / FILTER FUNCTIONS
 * Helper functions related to encrypting and decrypting passwords and filtering a query

 * FilterQuery: Filters query
****************************************************/
import _ from "lodash";

const Tables = {
	userstbl: ["firstName", "lastName", "email"],
};

export const FilterQuery = (filterString, tableKey) => {
	if (filterString && filterString?.length > 0) {
		const keys = Tables[tableKey];
		const syntax = [];
		keys.forEach((ele) => {
			if (ele === "mobile") {
				syntax.push({ $where: `/^${filterString}.*/.test(this.mobile)` });
			} else {
				syntax.push({ [ele]: { $regex: filterString, $options: "i" } });
			}
		});

		return { $and: [{ isDeleted: false }, { $or: syntax }] };
	} else {
		return { isDeleted: false };
	}
};
