## BigQuery sample queries

These queries were used to analyze electronic health record data within Google BigQuery. The analysis focuses on statin usage, prescription refill behavior, and hospital readmissions.

This uses the publicly available Synthetic Patient Data in OMOP dataset from the USDHHS.

01_atorvastatin_tablet_ids:
Finds all concept IDs for single-ingredient atorvastatin tablets. Used to pull relevant prescriptions in later queries.


02_refill_gaps:
Tracks refill timing for atorvastatin:
- Flags late refills, 30+ day gaps
- Calculates late refill rates per patient
- Flags patients as low-adherence if >20% of refills are late

03_statin_concepts:
Looks for heart-related diagnoses within 7 days of a patient’s first statin prescription. Helps identify why they were prescribed the drug.

04_readmittance:
Flags patients with repeat heart-related diagnoses within 30 days, joins with refill behavior.

5_statin_final:
Create the final table.
Combines refill and readmission information with demographics and comorbidities.

