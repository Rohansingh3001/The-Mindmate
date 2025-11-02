# 🚀 Quick Start: Training Data Collection

## For Developers

### Testing the System

1. **Test Anonymization**
   ```javascript
   // In browser console
   import { testAnonymization } from './src/utils/dataAnonymization';
   testAnonymization();
   ```

2. **Check User Consent**
   - Open chat as new user
   - See consent modal appear
   - Click "Agree" or "Opt Out"
   - Verify choice persists on page reload

3. **Verify Data Storage**
   ```javascript
   // In browser console
   import { getTrainingDataStats } from './src/utils/trainingDataStorage';
   const stats = await getTrainingDataStats();
   console.log(stats);
   ```

4. **Export Training Dataset**
   ```javascript
   import { downloadTrainingDataset } from './src/utils/trainingDataStorage';
   await downloadTrainingDataset('jsonl'); // Download JSONL file
   ```

### Backend API Testing

```bash
# Get statistics
curl http://localhost:3000/api/training-data/stats

# Export all data
curl http://localhost:3000/api/training-data/export > training_data.jsonl

# Clear all data (admin only)
curl -X DELETE http://localhost:3000/api/training-data/clear
```

---

## For Product Managers

### What Users See

1. **First Chat Open**: Consent modal appears
   - Clear explanation: "Help Ira learn by storing anonymized chats"
   - Two options: "Agree" or "Opt Out"
   - Expandable details showing exactly what's anonymized
   - No pressure - both choices work the same

2. **After Consent**: Chat works normally
   - If "Agree": Data stored anonymously after each message
   - If "Opt Out": Nothing stored, works identically
   - Choice saved per user account

3. **Settings**: Can change preference anytime

### Metrics to Track

- **Consent Rate**: % of users who click "Agree"
- **Data Quality**: Conversations with no PII detected
- **Dataset Size**: Total anonymized conversations collected
- **Language Distribution**: English vs Hindi vs others
- **Category Distribution**: Anxiety, stress, depression, etc.

---

## For Data Scientists

### Dataset Format

Each line in JSONL file:
```json
{
  "prompt": "Mujhe exam stress ho raha hai",
  "response": "Yeh bilkul normal hai, chalo saath me ek chhoti breathing exercise karte hain.",
  "language": "hi",
  "persona": "ira",
  "category": "academic_work",
  "timestamp": "2025-10-28T10:30:00.000Z"
}
```

### Fine-Tuning Preparation

```python
from datasets import load_dataset

# Load your exported JSONL
dataset = load_dataset('json', data_files='mindmates_training_data.jsonl')

# Format for instruction tuning (Alpaca style)
def format_alpaca(example):
    return {
        'instruction': 'You are Ira, a compassionate mental health companion.',
        'input': example['prompt'],
        'output': example['response']
    }

formatted = dataset.map(format_alpaca)

# Now ready for LLaMA, Mistral, or GPT fine-tuning
```

### Recommended Models

- **LLaMA 3 8B**: Best balance of quality/size
- **Mistral 7B**: Fast inference, good multilingual
- **Gemma 7B**: Google's open model, strong instruction following
- **GPT-3.5**: If using OpenAI fine-tuning API

### Training Tips

1. **Start with 10K+ conversations** minimum
2. **Balance categories**: Equal anxiety, stress, depression samples
3. **Multilingual mixing**: Keep Hindi-English code-switching
4. **Validation set**: Hold out 10% for evaluation
5. **Prompt format**: Consistent system prompts for Ira's personality

---

## Compliance Checklist

✅ Explicit consent obtained before data collection  
✅ Clear explanation of data usage  
✅ User can opt out without penalty  
✅ PII automatically removed  
✅ Data used only for stated purpose (AI training)  
✅ Users can change preference anytime  
✅ No data sold or shared with third parties  
✅ Secure storage (encrypted at rest)  
✅ Access controls on export/delete endpoints  
✅ DPDP Act 2023 compliant  

---

## Troubleshooting

### "No data being stored"
- Check user consented (localStorage: `chat_training_consent_<uid>`)
- Verify IndexedDB database exists: "MindMatesTrainingData"
- Check browser console for storage errors

### "PII still visible in data"
- Run validation: `validateAnonymization(text)`
- Add more patterns to dataAnonymization.js
- Report false negatives to team

### "Backend not receiving data"
- Check VITE_BACKEND_URL environment variable
- Verify backend server running on port 3000
- Check network tab for API calls

---

## Next Steps

1. **Week 1-2**: Monitor consent rates and data quality
2. **Month 1-3**: Collect 5,000+ conversations
3. **Month 3-6**: Reach 10,000+ conversations target
4. **Month 6+**: Export dataset and start fine-tuning
5. **Month 7+**: Deploy fine-tuned model, measure improvement

---

**Questions?** Check `/docs/training-data-pipeline.md` for full documentation.
