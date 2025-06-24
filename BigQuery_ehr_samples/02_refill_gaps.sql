WITH atorvastatin_exposure AS (
 SELECT
   person_id,
   drug_exposure_start_date,
   days_supply,
   drug_concept_id,
   --   assign increasing number to each prescription per person, ordered by start date, to track multiple prescriptions
   ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY drug_exposure_start_date) AS rx_order,
   -- look at previous prescription start date and supply days
   LAG(drug_exposure_start_date) OVER (PARTITION BY person_id ORDER BY drug_exposure_start_date) AS previous_start,
   LAG(days_supply) OVER (PARTITION BY person_id ORDER BY drug_exposure_start_date) AS previous_days_supply
 FROM
   `bigquery-public-data.cms_synthetic_patient_data_omop.drug_exposure`
 WHERE
   drug_concept_id IN (
     SELECT drug_concept_id FROM `mimic-iv-459422.statin_analysis.atorvastatin_tablet_ids`
   )
)


SELECT
 person_id,
 drug_exposure_start_date,
 previous_start,
 previous_days_supply,
 --  find number of days between when the patient should have run out of their previous supply and when they actually filled the next prescription, filling in 0 for null
 DATE_DIFF(drug_exposure_start_date, DATE_ADD(previous_start, INTERVAL IFNULL(previous_days_supply, 0) DAY), DAY) AS refill_gap_days
FROM
 atorvastatin_exposure
WHERE
 rx_order > 1
ORDER BY
 person_id, drug_exposure_start_date;


-- QUery for late_refiller flag > 20% 
SELECT
 person_id,
 COUNT(*) AS total_refills,
 SUM(CASE WHEN refill_gap_days > 30 THEN 1 ELSE 0 END) AS late_refills,
 -- safe divide prevents division-by-zero errors
 -- create flag for late_refills, calculate rate of late refills vs on-time, flag those with 20% + rates
 SAFE_DIVIDE(SUM(CASE WHEN refill_gap_days > 30 THEN 1 ELSE 0 END), COUNT(*)) AS late_refill_rate,
 CASE
   WHEN SAFE_DIVIDE(SUM(CASE WHEN refill_gap_days > 30 THEN 1 ELSE 0 END), COUNT(*)) > 0.2 THEN 1
   ELSE 0
 END AS low_adherence_flag
FROM
 `mimic-iv-459422.statin_analysis.refill_gaps`
GROUP BY person_id
