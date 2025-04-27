import express from "express";
import db from "./db.js";

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/home", (req, res) => {
  res.send("Server is ready");
});

app.get("/test", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM public.mp_circumstances_physical WHERE hair_color = $1`,
      ["Brown"],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/mp/search", async (req, res) => {
  try {
    const {
      case_number,
      ncmec_number,
      first_name,
      middle_name,
      last_name,
      state,
      county,
      city,
      biological_sex,
      missing_age,
      current_age,
      race_ethnicity,
      tribal_affiliation,
      height_min,
      height_max,
      weight,
      eye_color,
      hair_color,
      sortBy,
      sortOrder,
    } = req.query;

    let query = `
            SELECT mp.*, mcp.* 
            FROM missing_persons mp
            LEFT JOIN mp_circumstances_physical mcp 
            ON mp.case_number = mcp.case_number
            WHERE 1=1
        `;
    const params = [];

    if (case_number) {
      query += ` AND mp.case_number = $${params.length + 1}`;
      params.push(case_number);
    }
    if (ncmec_number) {
      query += ` AND mp.ncmec_number = $${params.length + 1}`;
      params.push(ncmec_number);
    }
    if (first_name) {
      query += ` AND mp.first_name = $${params.length + 1}`;
      params.push(first_name);
    }
    if (middle_name) {
      query += ` AND mp.middle_name = $${params.length + 1}`;
      params.push(middle_name);
    }
    if (last_name) {
      query += ` AND mp.last_name = $${params.length + 1}`;
      params.push(last_name);
    }
    if (state) {
      query += ` AND mp.state = $${params.length + 1}`;
      params.push(state);
    }
    if (county) {
      query += ` AND mp.county = $${params.length + 1}`;
      params.push(county);
    }
    if (city) {
      query += ` AND mp.city = $${params.length + 1}`;
      params.push(city);
    }
    if (biological_sex) {
      query += ` AND mp.biological_sex = $${params.length + 1}`;
      params.push(biological_sex);
    }
    if (missing_age) {
      query += ` AND mp.missing_age = $${params.length + 1}`;
      params.push(missing_age);
    }
    if (current_age) {
      query += ` AND mp.current_age = $${params.length + 1}`;
      params.push(current_age);
    }
    if (race_ethnicity) {
      query += ` AND mp.race_or_ethnicity = $${params.length + 1}`;
      params.push(race_ethnicity);
    }
    if (tribal_affiliation) {
      query += ` AND mp.tribal_affiliation = $${params.length + 1}`;
      params.push(tribal_affiliation);
    }

    if (height_min && height_max) {
      query += ` AND mcp.height BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(height_min, height_max);
    } else if (height_min) {
      query += ` AND mcp.height >= $${params.length + 1}`;
      params.push(height_min);
    } else if (height_max) {
      query += ` AND mcp.height <= $${params.length + 1}`;
      params.push(height_max);
    }

    if (weight) {
      query += ` AND mcp.weight = $${params.length + 1}`;
      params.push(weight);
    }

    if (eye_color) {
      query += ` AND (mcp.left_eye_color = $${params.length + 1} OR mcp.right_eye_color = $${params.length + 1})`;
      params.push(eye_color);
    }

    if (hair_color) {
      query += ` AND mcp.hair_color = $${params.length + 1}`;
      params.push(hair_color);
    }

    if (sortBy) {
      const order = sortOrder === "desc" ? "DESC" : "ASC";
      query += ` ORDER BY ${sortBy} ${order}`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/up/search", async (req, res) => {
  try {
    const {
      namus_number,
      date_found,
      state,
      county,
      city,
      biological_sex,
      missing_age,
      age_from,
      age_to,
      primary_ethnicity,
      height_min,
      height_max,
      weight,
      eye_color,
      hair_color,
      sortBy,
      sortOrder,
    } = req.query;

    let query = `
            SELECT ucp.*, up.* 
            FROM unidentified_persons up
            LEFT JOIN up_circumstances_physical ucp 
            ON up.namus_number = ucp.namus_number
            WHERE 1=1
        `;
    const params = [];

    if (namus_number) {
      query += ` AND up.namus_number = $${params.length + 1}`;
      params.push(namus_number);
    }
    if (date_found) {
      query += ` AND up.date_found = $${params.length + 1}`;
      params.push(date_found);
    }
    if (state) {
      query += ` AND up.state = $${params.length + 1}`;
      params.push(state);
    }
    if (county) {
      query += ` AND up.county = $${params.length + 1}`;
      params.push(county);
    }
    if (city) {
      query += ` AND up.city = $${params.length + 1}`;
      params.push(city);
    }
    if (biological_sex) {
      query += ` AND up.biological_sex = $${params.length + 1}`;
      params.push(biological_sex);
    }
    if (missing_age) {
      query += ` AND up.missing_age = $${params.length + 1}`;
      params.push(missing_age);
    }

    if (age_from && age_to) {
      query += ` AND up.missing_age BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(age_from, age_to);
    } else if (age_from) {
      query += ` AND up.missing_age >= $${params.length + 1}`;
      params.push(age_from);
    } else if (age_to) {
      query += ` AND up.missing_age <= $${params.length + 1}`;
      params.push(age_to);
    }

    if (primary_ethnicity) {
      query += ` AND up.primary_ethnicity = $${params.length + 1}`;
      params.push(primary_ethnicity);
    }

    if (height_min && height_max) {
      query += ` AND (
                ucp.height_from BETWEEN $${params.length + 1} AND $${params.length + 2} 
                OR (
                    ucp.height_certainty ~ '^[0-9]+$' -- Ensure it's numeric before casting
                    AND (ucp.height_from + CAST(ucp.height_certainty AS INTEGER)) BETWEEN $${params.length + 1} AND $${params.length + 2}
                )
            )`;
      params.push(height_min, height_max);
    } else if (height_min) {
      query += ` AND (
                ucp.height_from >= $${params.length + 1} 
                OR (
                    ucp.height_certainty ~ '^[0-9]+$'
                    AND (ucp.height_from + CAST(ucp.height_certainty AS INTEGER)) >= $${params.length + 1}
                )
            )`;
      params.push(height_min);
    } else if (height_max) {
      query += ` AND (
                ucp.height_from <= $${params.length + 1} 
                OR (
                    ucp.height_certainty ~ '^[0-9]+$'
                    AND (ucp.height_from + CAST(ucp.height_certainty AS INTEGER)) <= $${params.length + 1}
                )
            )`;
      params.push(height_max);
    }

    if (weight) {
      query += ` AND (
                ucp.weight_certainty ~ '^[0-9]+$' 
                AND ABS(CAST(ucp.weight_certainty AS INTEGER) - $${params.length + 1}) <= 5
            )`;
      params.push(weight);
    }

    if (eye_color) {
      query += ` AND (ucp.left_eye_color = $${params.length + 1} OR ucp.right_eye_color = $${params.length + 1})`;
      params.push(eye_color);
    }

    if (hair_color) {
      query += ` AND ucp.hair_color = $${params.length + 1}`;
      params.push(hair_color);
    }

    if (sortBy) {
      const order = sortOrder === "desc" ? "DESC" : "ASC";
      query += ` ORDER BY ${sortBy} ${order}`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/persons/search", async (req, res) => {
  const {
    state,
    county,
    city,
    biological_sex,
    missing_age,
    age_from,
    age_to,
    race_ethnicity,
    sortBy,
    sortOrder,
  } = req.query;

  const buildMissing = () => {
    let text = `SELECT * FROM missing_persons WHERE 1=1`;
    const params = [];

    if (state) {
      params.push(state);
      text += ` AND state = $${params.length}`;
    }
    if (county) {
      params.push(county);
      text += ` AND county = $${params.length}`;
    }
    if (city) {
      params.push(city);
      text += ` AND city = $${params.length}`;
    }
    if (biological_sex) {
      params.push(biological_sex);
      text += ` AND biological_sex = $${params.length}`;
    }
    if (missing_age) {
      params.push(missing_age);
      text += ` AND missing_age = $${params.length}`;
    }
    if (age_from) {
      params.push(age_from);
      text += ` AND missing_age >= $${params.length}`;
    }
    if (age_to) {
      params.push(age_to);
      text += ` AND missing_age <= $${params.length}`;
    }
    if (race_ethnicity) {
      params.push(race_ethnicity);
      text += ` AND race_or_ethnicity = $${params.length}`;
    }

    if (sortBy) {
      const dir = sortOrder === "desc" ? "DESC" : "ASC";
      text += ` ORDER BY ${sortBy} ${dir}`;
    }

    return { text, params };
  };
  const buildUnidentified = () => {
    let text = `SELECT * FROM unidentified_persons WHERE 1=1`;
    const params = [];

    // always exclude “Uncertain”
    text += ` AND primary_ethnicity <> 'Uncertain'`;

    if (state) {
      params.push(state);
      text += ` AND state = $${params.length}`;
    }
    if (county) {
      params.push(county);
      text += ` AND county = $${params.length}`;
    }
    if (city) {
      params.push(city);
      text += ` AND city = $${params.length}`;
    }
    if (biological_sex) {
      params.push(biological_sex);
      text += ` AND biological_sex = $${params.length}`;
    }

    // age‐range overlap
    if (age_from) {
      params.push(age_from);
      text += ` AND estimated_age_to >= $${params.length}`;
    }
    if (age_to) {
      params.push(age_to);
      text += ` AND estimated_age_from <= $${params.length}`;
    }

    // include exact match OR “Multiple” when filtering
    if (race_ethnicity) {
      params.push(race_ethnicity); // e.g. 'White'
      params.push("Multiple");
      text += ` AND (
        primary_ethnicity = $${params.length - 1}
        OR primary_ethnicity = $${params.length}
      )`;
    }

    if (sortBy) {
      const dir = sortOrder === "desc" ? "DESC" : "ASC";
      text += ` ORDER BY ${sortBy} ${dir}`;
    }

    return { text, params };
  };

  try {
    const [miss, unid] = await Promise.all([
      db.query(...Object.values(buildMissing())),
      db.query(...Object.values(buildUnidentified())),
    ]);

    res.json({
      missing_persons: miss.rows,
      unidentified_persons: unid.rows,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

app.get("/mp/:case_number", async (req, res) => {
  const { case_number } = req.params;
  try {
    const result = await db.query(
      `SELECT mp.*, mcp.*, ma.*, mi.* 
             FROM public.missing_persons mp
             LEFT JOIN public.mp_circumstances_physical mcp 
             ON mp.case_number = mcp.case_number
             LEFT JOIN public.mp_articles ma
             ON mp.case_number = ma.case_number
             LEFT JOIN public.mp_images mi
             ON mp.case_number = mi.case_number
             WHERE mp.case_number = $1`,
      [case_number],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch case details" });
  }
});

app.get("/up/:namus_number", async (req, res) => {
  const { namus_number } = req.params;
  try {
    const result = await db.query(
      `SELECT ucp.*, ua.*, ui.*, up.*
             FROM public.unidentified_persons up
             LEFT JOIN public.up_circumstances_physical ucp 
             ON up.namus_number = ucp.namus_number
             LEFT JOIN public.up_articles ua
             ON up.namus_number = ua.namus_number
             LEFT JOIN public.up_images ui
             ON up.namus_number = ui.namus_number
             WHERE up.namus_number = $1`,
      [namus_number],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch case details" });
  }
});

app.get("/persons/:mp_case_number/:up_namus_number", async (req, res) => {
  const { mp_case_number, up_namus_number } = req.params;

  try {
    const missingResult = await db.query(
      `SELECT mp.*, mcp.*, ma.*, mi.* 
             FROM public.missing_persons mp
             LEFT JOIN public.mp_circumstances_physical mcp 
             ON mp.case_number = mcp.case_number
             LEFT JOIN public.mp_articles ma
             ON mp.case_number = ma.case_number
             LEFT JOIN public.mp_images mi
             ON mp.case_number = mi.case_number
             WHERE mp.case_number = $1`,
      [mp_case_number],
    );

    const unidentifiedResult = await db.query(
      `SELECT ucp.*, ua.*, ui.*, up.* 
             FROM public.unidentified_persons up
             LEFT JOIN public.up_circumstances_physical ucp 
             ON up.namus_number = ucp.namus_number
             LEFT JOIN public.up_articles ua
             ON up.namus_number = ua.namus_number
             LEFT JOIN public.up_images ui
             ON up.namus_number = ui.namus_number
             WHERE up.namus_number = $1`,
      [up_namus_number],
    );

    if (
      missingResult.rows.length === 0 &&
      unidentifiedResult.rows.length === 0
    ) {
      return res.status(404).json({ error: "Neither case found" });
    } else if (missingResult.rows.length === 0) {
      return res.status(404).json({ error: "Missing person case not found" });
    } else if (unidentifiedResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Unidentified person case not found" });
    }

    res.json({
      missing_person: missingResult.rows[0],
      unidentified_person: unidentifiedResult.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch case details", details: error.message });
  }
});

// Start the server at /home
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}/home`);
});
