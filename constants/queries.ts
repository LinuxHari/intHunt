export const USER_INTERACTIONS_QUERY = `
CREATE OR REPLACE TABLE \`ai-interviewer-889d1.analytics_490492273.user_job_role_interactions\` AS
SELECT
  user_pseudo_id AS user_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_id') AS item_id,
  SUM(CASE
    WHEN event_name = 'interview_completed' THEN 5
    WHEN event_name = 'interview_scheduled' THEN 3
    WHEN event_name = 'interview_clicked' THEN 1
    ELSE 0
  END) AS interaction_score
FROM
  \`ai-interviewer-889d1.analytics_490492273.events_*\`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY))
                  AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY))
  AND event_name IN ('interview_clicked', 'interview_completed', 'interview_scheduled')
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_id') IS NOT NULL
  AND user_pseudo_id IS NOT NULL
GROUP BY
  user_id, item_id
HAVING
  item_id IS NOT NULL AND interaction_score > 0;
`;

export const INTERVIEW_FEATURES_QUERY = `
CREATE OR REPLACE TABLE \`ai-interviewer-889d1.analytics_490492273.interview_features\` AS
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_id') AS item_id,
  ANY_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_role')) AS role_feature,
  ANY_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_techstack')) AS techstack_feature,
  ANY_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_level')) AS level_feature,
  ANY_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_type')) AS type_feature,
  ANY_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_difficulty')) AS difficulty_feature,
  ANY_VALUE(CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'interview_attendees') AS FLOAT64)) AS attendees_feature,
  ANY_VALUE(CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'interview_average_rating') AS FLOAT64)) AS rating_feature
FROM
  \`ai-interviewer-889d1.analytics_490492273.events_*\`
WHERE
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY))
                  AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY))
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'interview_id') IS NOT NULL
GROUP BY
  item_id
HAVING
  item_id IS NOT NULL;
`;

export const TRAIN_MODEL_QUERY = `
CREATE OR REPLACE MODEL \`ai-interviewer-889d1.analytics_490492273.job_recommendation_model_with_features\`
OPTIONS(
  MODEL_TYPE='DNN_REGRESSOR',
  INPUT_LABEL_COLS=['interaction_score'],
  ENABLE_GLOBAL_EXPLAIN=TRUE,
  HIDDEN_UNITS=[64, 32],
  MAX_ITERATIONS=20,
  L2_REG=0.01,
  OPTIMIZER='ADAGRAD'
)
AS
SELECT
  t1.user_id,
  t1.interaction_score,
  t2.role_feature,
  t2.techstack_feature,
  t2.level_feature,
  t2.type_feature,
  t2.difficulty_feature,
  t2.attendees_feature,
  t2.rating_feature
FROM
  \`ai-interviewer-889d1.analytics_490492273.user_job_role_interactions\` AS t1
JOIN
  \`ai-interviewer-889d1.analytics_490492273.interview_features\` AS t2
ON
  t1.item_id = t2.item_id;
`;

export const getRecommendationsQuery = (userId: string) => `
SELECT
  item_id,
  predicted_interaction_score
FROM
  ML.PREDICT(
    MODEL \`ai-interviewer-889d1.analytics_490492273.job_recommendation_model_with_features\`,
    (
      SELECT
        T2.item_id,
        T2.role_feature,
        T2.techstack_feature,
        T2.level_feature,
        T2.type_feature,
        T2.difficulty_feature,
        T2.attendees_feature,
        T2.rating_feature,
        '${userId}' AS user_id,
        0.0 AS interaction_score -- interaction_score is not known for prediction
      FROM
        \`ai-interviewer-889d1.analytics_490492273.interview_features\` AS T2
      CROSS JOIN
        (SELECT 1)
    )
  )
ORDER BY predicted_interaction_score DESC
LIMIT 10;
`;
