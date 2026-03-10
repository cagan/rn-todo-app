# Git Workflow

## Branch Stratejisi
- `main` → production-ready, direkt commit yasak
- `develop` → integration branch
- `feature/kısa-açıklama` → yeni feature
- `fix/kısa-açıklama` → bug fix
- `refactor/kısa-açıklama` → refactoring

## Commit Mesajı Formatı (Conventional Commits)
```
type(scope): kısa açıklama

[opsiyonel body]

[opsiyonel footer]
```

Types:
- `feat` → yeni özellik
- `fix` → bug fix
- `refactor` → yeniden yapılandırma (davranış değişmez)
- `test` → test ekleme/düzenleme
- `docs` → dokümantasyon
- `chore` → build, config değişikliği

Örnekler:
```
feat(todo): add deadline field to todo items
fix(storage): handle AsyncStorage null return
test(TodoItem): add edge case for long titles
```

## PR Kuralları
- PR açmadan önce: `npm test` geçmeli, lint temiz olmalı
- PR description'ına "Ne değişti?" ve "Neden?" yaz
- Self-review yap (@code-reviewer subagent kullan)
- Feature branch'i squash merge ile main'e al

## Commit Öncesi Checklist
- [ ] Testler geçiyor mu? (`npm test`)
- [ ] Lint temiz mi? (`npm run lint`)
- [ ] TypeScript hata yok mu? (`npx tsc --noEmit`)
- [ ] Console.log kaldırıldı mı?
- [ ] Commit mesajı formatına uygun mu?
